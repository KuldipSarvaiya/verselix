import { Controller, Get, Post, Query, Res, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUserId, JwtAuthGuard, UserDetails } from './index';
import { 
  ApiLogin, 
  ApiLoginUrl, 
  ApiCallback, 
  ApiGetCurrentUser, 
  ApiPromoteToAdmin 
} from './swagger/auth.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiLogin()
  async login(@Res() res) {
    const url = await this.authService.getGoogleSignInUrl();
    return res.redirect(url);
  }

  @Get('login-url')
  @ApiLoginUrl()
  async getLoginUrl() {
    const url = await this.authService.getGoogleSignInUrl();
    return { url };
  }

  @Get('callback')
  @ApiCallback()
  async callback(@Query('code') code: string, @Res() res) {
    const jwt = await this.authService.handleCallback(code);
    return res.json({ token: jwt });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiGetCurrentUser()
  async getCurrentUser(@GetUserId() userId: string): Promise<UserDetails> {
    return this.authService.getCurrentUser(userId);
  }

  @Post('promote-to-admin')
  @UseGuards(JwtAuthGuard)
  @ApiPromoteToAdmin()
  async promoteToAdmin(@GetUserId() userId: string) {
    return this.authService.promoteToAdmin(userId);
  }
}
