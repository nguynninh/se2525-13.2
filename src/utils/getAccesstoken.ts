import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const buildScope = (roles: string[]): string => {
    const scopes: string[] = [];

    if (roles && roles.length > 0) {
        roles.forEach((role: string) => {
            scopes.push(`ROLE_${role}`);
        });
    }

    return scopes.join(' ');
};

export const getAccesstoken = async (
    id: string,
    roles: string[],
    durationSeconds: number = 600,
    isRefresh: boolean = false
): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        sub: id,
        iss: process.env.JWT_ISSUER,
        iat: now,
        exp: now + durationSeconds,
        jti: crypto.randomUUID(),
        scope: buildScope(roles)
    };

    const key = isRefresh ? process.env.REFRESH_SECRET_KEY : process.env.SECRET_KEY;

    const token = jwt.sign(
        payload,
        key as string,
        {
            algorithm: 'HS512'
        }
    );

    return token;
};