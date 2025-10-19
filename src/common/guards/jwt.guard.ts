// Kiểm tra token JWT trong header Authorization, bỏ qua nếu @IsPublic

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthType } from '../constants';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const authMetadata = this.reflector.getAllAndOverride<{
            authTypes: AuthType[];
            options: { condition: string };
        }>(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]);

        if (
            !authMetadata ||
            authMetadata.authTypes.includes(AuthType.None) ||
            !authMetadata.authTypes.includes(AuthType.Jwt)
        ) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) throw new UnauthorizedException('Không tìm thấy token');

        try {
            const payload = this.jwtService.verify(token, { secret: jwtConfig.accessSecret });
            request.user = { sub: payload.sub, role: payload.role };
            return true;
        } catch {
            throw new UnauthorizedException('Token không hợp lệ');
        }
    }
}
