import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../enums/roles.enum';
import { DataSource } from 'typeorm';
import { Staff } from '../../database/entities';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(DataSource) private dataSource: DataSource,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Nếu @Public thì khỏi check AUTH
      const isPublic = this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );
      if (isPublic) {
        return true;
      }
      // kiểm tra access token
      const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
        'auth_role',
        [context.getHandler(), context.getClass()],
      );

      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.replace(/^bearer\s/gi, '');

      if (!token) {
        throw new UnauthorizedException();
      }

      // Lấy user id từ access token
      const user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      const isValidRole = requiredRoles.some((role) => role === user?.role);
      if (!isValidRole && requiredRoles?.length > 0) {
        throw new UnauthorizedException();
      }

      const controllerUrl = req.url.split('/')[1];
      const controller = controllerUrl.split('?')[0];

      if (user?.role == 'staff') {
        const staffInfo = await this.dataSource.getRepository(Staff).findOne({
          where: { id: user.id }
        });
        if (staffInfo.accessToken !== token) {
          throw new Error('jwt expired');
        }
        delete user.iat;
        delete user.exp;
        user.token = token;
        req.user = user;
        return true;
      } else {
        delete user.iat;
        delete user.exp;
        user.token = token;
        req.user = user;
        return true;
      }
    } catch (error) {
      if (error.message == 'permission') {
        throw new HttpException(
          'Error:dont have permission module',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error.message == 'jwt expired') {
        throw new Error('ACCESS_TOKEN_EXPIRED');
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
