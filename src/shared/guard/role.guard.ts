import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'generated/prisma/enums';

import { RequestUserModel } from '../../auth/dto';
import { ROLES_KEY } from '../decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: RequestUserModel } = context
      .switchToHttp()
      .getRequest();

    return requiredRoles.some((role) => user.role === role);
  }
}
