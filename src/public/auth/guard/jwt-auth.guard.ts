import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof Error) {
      throw new UnauthorizedException(
        'You are not logged in, please log in again!',
      );
    }

    return super.handleRequest(err, user, info, context, status);
  }
}