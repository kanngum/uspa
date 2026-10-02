import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
  ) {
    if (err || !user) {
      return null;
    }

    return user;
  }
}