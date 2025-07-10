import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

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
      });

      console.log(dbUser);
      console.log(jwt);

      return jwt;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
