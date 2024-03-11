import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/roles.enum';

export const Auth = (...roles: Roles[]) => SetMetadata('auth_role', roles);
