import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CreateAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest();
    if (
      !headers['authorization'] ||
      headers['authorization']?.replace(/^bearer\s/gi, '') !==
        process.env.CREATE_ADMIN_TOKEN
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
