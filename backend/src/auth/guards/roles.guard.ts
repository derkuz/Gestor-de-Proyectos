import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No roles required
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.rol) {
            throw new ForbiddenException('Usuario sin privilegios');
        }

        const hasRole = requiredRoles.some((role) => user.rol === role);

        if (!hasRole) {
            throw new ForbiddenException(`Se requiere uno de estos roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}
