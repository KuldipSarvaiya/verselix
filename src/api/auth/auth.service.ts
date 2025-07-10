import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from './types/user-details.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async getGoogleSignInUrl(): Promise<string> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.SUPABASE_REDIRECT_URL,
        },
      });

      if (error) throw new UnauthorizedException(error.message);
      return data.url;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async handleCallback(code: string): Promise<string> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.user) throw new UnauthorizedException();

      const { email, user_metadata } = data.user;
      const firstName = user_metadata?.full_name?.split(' ')[0] ?? '';
      const lastName = user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? '';
      const picture = user_metadata?.avatar_url ?? '';

      const existing = await this.prisma.user.findUnique({ where: { email } });

      const dbUser = existing || await this.prisma.user.create({
        data: {
          email: email || '--no-email--',
          firstName,
          lastName,
          picture,
          role: 'USER',
          provider: 'google',
        },
      });

      const jwt = this.jwtService.sign({
        sub: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        picture: dbUser.picture,
        provider: dbUser.provider,
      });

      console.log(dbUser);
      console.log(jwt);

      return jwt;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCurrentUser(userId: string): Promise<UserDetails> {
    try {
      const user: UserDetails | null = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          picture: true,
          role: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user details');
    }
  }

  async promoteToAdmin(userId: string): Promise<{ message: string; requiresReauth: boolean }> {
    try {
      // Update user role to ADMIN
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { role: 'ADMIN' },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'Successfully promoted to admin. Please login again to get the updated token with admin privileges.',
        requiresReauth: true
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to promote user to admin');
    }
  }
}
