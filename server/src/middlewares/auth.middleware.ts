// Xử lý xác thực và phân quyền trong ứng dụng

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { UserRole } from '../models/User.model';
import { UnauthorizedError, AppError, InternalServerError } from '../exception/AppError';

type AccessClaims = JwtPayload & { sub: string; role: UserRole };

function getAccessSecret(): string {
    const s = process.env.JWT_ACCESS_SECRET;
    if (!s) throw new InternalServerError('auth:server_misconfigured');
    return s;
}

// Middleware xác thực JWT
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('auth:no_token_provided');
        }

        const token = authHeader.slice('Bearer '.length).trim();

        let decoded: AccessClaims;
        try {
            decoded = jwt.verify(token, getAccessSecret()) as AccessClaims;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return next(new UnauthorizedError('auth:token_expired'));
            }
            return next(new UnauthorizedError('auth:invalid_token'));
        }

        req.user = { id: decoded.sub, role: decoded.role };
        return next();
    } catch (err) {
        return next(err);
    }
};

// Middleware phân quyền dựa trên vai trò
export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('auth:unauthenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError('auth:access_denied', 403));
        }
        return next();
    };
};
