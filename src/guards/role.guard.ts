import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Debug için log ekleyelim
    console.log('Required Roles:', requiredRoles);
    console.log('User:', user);
    console.log('User Role:', user?.role?.name);

    // Admin her şeyi yapabilir
    if (user?.role?.name === 'ADMIN') {
      return true;
    }

    // Diğer roller için kontrol
    return requiredRoles.some((role) => user?.role?.name === role);
  }
}
