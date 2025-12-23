// Xử lý xác thực và phân quyền trong ứng dụng

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../models/User.model';
import { UnauthorizedError, AppError, InternalServerError } from '../exception/AppError';

const JWT_SECRET = process.env.JWT_SECRET;

type Claims = JwtPayload & { id: string; role: UserRole };

// Middleware xác thực JWT
// Kiểm tra token trong header Authorization, giải mã và gán thông tin người dùng vào req.user
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lấy header Authorization
        const authHeader = req.headers.authorization;

        // Kiểm tra xem header có tồn tại và bắt đầu bằng 'Bearer ' hay không
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('auth:no_token_provided');
        }

        // Tách token từ header
        const token = authHeader.split(' ')[1];
        const secret = JWT_SECRET;
        if (!secret) return next(new InternalServerError('auth:server_misconfigured'));

        // Giải mã token bằng JWT_SECRET
        const decoded = jwt.verify(token, secret) as Claims;

        // Gán thông tin người dùng (ID và vai trò) vào req.user để sử dụng ở các middleware/route sau
        req.user = { id: decoded.id, role: decoded.role };

        next();
    } catch (error) {
        // Ném lỗi nếu token không hợp lệ hoặc hết hạn
        next(new UnauthorizedError('auth:invalid_token'));
    }
};

// Middleware phân quyền dựa trên vai trò
// Chỉ cho phép người dùng có vai trò cụ thể truy cập
export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Kiểm tra xem req.user có tồn tại
        if (!req.user) {
            return next(new UnauthorizedError('auth:unauthenticated')); // Ném lỗi nếu chưa xác thực
        }

        // Kiểm tra xem vai trò của người dùng có nằm trong danh sách vai trò được phép hay không
        if (!roles.includes(req.user.role)) {
            return next(new AppError('auth:access_denied', 403));
        }

        next();
    };
};
