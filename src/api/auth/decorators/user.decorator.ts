import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): JwtPayload | any => {
    const request = ctx.switchToHttp().getRequest();
    const jwtPayload = request.user as JwtPayload;

    if (!jwtPayload) {
      throw new UnauthorizedException('User not found in request');
    }

    // Return JWT payload directly (already validated by JwtAuthGuard)
    return data ? jwtPayload[data as keyof JwtPayload] : jwtPayload;
  },
); 