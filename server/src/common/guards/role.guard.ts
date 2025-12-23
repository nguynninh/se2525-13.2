import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AuthType, AUTH_TYPE_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const authMetadata = this.reflector.getAllAndOverride<{ authTypes: AuthType[] }>(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (authMetadata?.authTypes.includes(AuthType.None)) return true; // @IsPublic

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.role) throw new ForbiddenException('Không có thông tin vai trò');

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) throw new ForbiddenException('Vai trò không được phép');

        return true;
    }
}
