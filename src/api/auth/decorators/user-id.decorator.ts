import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return user.sub;
  },
); 