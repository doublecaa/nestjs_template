import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../enums/roles.enum';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
        'auth_role',
        [context.getHandler(), context.getClass()],
      );

      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.replace(/^bearer\s/gi, '');

      if (!token) {
        throw new UnauthorizedException();
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const isValidRole = requiredRoles.some((role) => role === user?.role);
      if (!isValidRole && requiredRoles?.length > 0) {
        throw new UnauthorizedException();
      }

      delete user.iat;
      delete user.exp;
      user.token = token;
      req.user = user;

      return true;
    } catch (error) {
      if (error.message == 'jwt expired') {
        throw new Error('REFRESH_TOKEN_EXPIRED');
      }
      throw new UnauthorizedException();
    }
  }
}
