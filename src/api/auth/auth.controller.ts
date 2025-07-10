import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(@Res() res) {
    const url = await this.authService.getGoogleSignInUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res) {
    const jwt = await this.authService.handleCallback(code);
    return res.json({ token: jwt });
  }
}
