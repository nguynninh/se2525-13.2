import type { JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'AccessSecrect',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'RefreshSecrect',
    accessExpiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as JwtSignOptions['expiresIn'],
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as JwtSignOptions['expiresIn'],
};
