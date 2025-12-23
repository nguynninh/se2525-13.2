import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Redis } from 'ioredis';
import { redisConfig } from '../../config/redis.config';
import { AUTH_TYPE_KEY, AuthType } from '../constants';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private redisClient: Redis;

    constructor(private reflector: Reflector) {
        this.redisClient = new Redis(redisConfig);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authMetadata = this.reflector.getAllAndOverride<{
            authTypes: AuthType[];
            options: { condition: string };
        }>(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]);
        if (
            !authMetadata ||
            authMetadata.authTypes.includes(AuthType.None) ||
            !authMetadata.authTypes.includes(AuthType.ApiKey)
        ) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey) throw new UnauthorizedException('Không tìm thấy API Key');

        const keyData = await this.redisClient.get(`api-key:${apiKey}`);
        if (!keyData) throw new UnauthorizedException('API Key không hợp lệ');

        const payload = JSON.parse(keyData);
        request.user = { sub: apiKey, role: payload.role };
        return true;
    }
}
