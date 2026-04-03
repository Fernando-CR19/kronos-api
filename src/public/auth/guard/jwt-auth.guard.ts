import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status: any,
  ): TUser {
    if (info instanceof Error) {
      throw new UnauthorizedException(
        'You are not logged in, please log in again!',
      );
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
