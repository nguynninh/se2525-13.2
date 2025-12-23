// logic điều khiển cho các hành động xác thực
// Bao gồm đăng ký, đăng nhập, làm mới token, đăng nhập xã hội, và quản lý hồ sơ
import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { authRegister } from './auth.service';
import { redisHelper } from '../../utils/redisHelper';
import { UnauthorizedError } from '../../exception/AppError';
import { UserRole } from '../../models/User.model';
import { LoginDto, SocialLoginDto, RefreshTokenDto, AuthResponseDto, RefreshTokenResponseDto } from './auth.dto';
import {
    RegisterStartDto,
    RegisterResendDto,
    RegisterFinalizeDto,
    RegisterStartResponse,
    RegisterResendResponse,
    RegisterFinalizeResponse,
} from '../user/user.dto';

interface AuthRequest extends Request {
    user?: { id: string; role: UserRole };
}

// Đổi ngày (d), giờ (h) và phút (m) dạng chuỗi thành giây (s) dạng số
function toSeconds(exp: string | number | undefined): number {
    if (!exp) return 7 * 24 * 60 * 60; // Mặc định là 7 ngày nếu không set
    if (typeof exp === 'number') return exp;
    const m = /^(\d+)([smhd])$/i.exec(exp.trim());
    if (!m) return 7 * 24 * 60 * 60;
    const n = Number(m[1]);
    const u = m[2].toLowerCase();
    return u === 's' ? n : u === 'm' ? n * 60 : u === 'h' ? n * 3600 : n * 86400;
}

// TTL Redis cho refresh token
const REFRESH_TTL_SECONDS = toSeconds(process.env.JWT_REFRESH_EXPIRES_IN || '7d');

// Controller Register
export const registerController = {
    async start(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as RegisterStartDto;
            const result: RegisterStartResponse = await authRegister.start(dto);
            return response.ok(res, result, 'auth:otp_sent');
        } catch (err) {
            next(err);
        }
    },

    async resend(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as RegisterResendDto;
            const result: RegisterResendResponse = await authRegister.resend(dto);
            return response.ok(res, result, 'auth:otp_resent');
        } catch (err) {
            next(err);
        }
    },

    async finalize(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as RegisterFinalizeDto;
            const user: RegisterFinalizeResponse = await authRegister.finalize(dto);
            return response.ok(res, user, 'auth:register_success');
        } catch (err) {
            next(err);
        }
    },
};

// const authController = {
//     // Đăng ký tài khoản (CreateUserDto): kiểm tra OTP ở service, tạo user, trả UserResponseDto
//     async register(req: Request, res: Response, next: NextFunction) {
//         try {
//             const dto = req.body as CreateUserDto; // { first_name, last_name, email, password, role, code }
//             const user: UserResponseDto = await authService.register(dto);
//             return response.created(res, user, 'auth:register_success');
//         } catch (error) {
//             next(error);
//         }
//     },

//     // Đăng nhập thường (LoginDto): trả user + accessToken + refreshToken
//     async login(req: Request, res: Response, next: NextFunction) {
//         try {
//             const dto = req.body as LoginDto; // { email, password }
//             const { user, accessToken, refreshToken }: AuthResponseDto = await authService.login(dto);

//             // Lưu refresh token để phục vụ /refresh
//             await redisHelper.set(`refresh_token:${user.id}`, refreshToken, REFRESH_TTL_SECONDS);

//             return response.ok(res, { user, accessToken, refreshToken }, 'auth:login_success');
//         } catch (error) {
//             next(error);
//         }
//     },

//     // Đăng nhập mạng xã hội (SocialLoginDto): { provider, credential }
//     async loginSocial(req: Request, res: Response, next: NextFunction) {
//         try {
//             // Lấy provider từ params, credential từ body
//             const provider = req.params.provider as SocialLoginDto['provider'];
//             const credential = (req.body?.credential ?? '') as SocialLoginDto['credential'];

//             const { user, accessToken, refreshToken }: AuthResponseDto = await authService.loginSocial({
//                 provider,
//                 credential,
//             });

//             await redisHelper.set(`refresh_token:${user.id}`, refreshToken, REFRESH_TTL_SECONDS);

//             return response.ok(res, { user, accessToken, refreshToken }, 'auth:login_success');
//         } catch (error) {
//             next(error);
//         }
//     },

//     // Làm mới token: nhận body { refreshToken }, trả { accessToken, refreshToken: newRefreshToken }
//     async refreshToken(req: Request, res: Response, next: NextFunction) {
//         try {
//             const dto = req.body as RefreshTokenDto;

//             const { id, accessToken } = await authService.refreshToken(dto);

//             return response.ok(res, { id, accessToken }, 'auth:token_refreshed');
//         } catch (error) {
//             next(error);
//         }
//     },

//     // Đăng xuất: xoá refresh token trong Redis theo user hiện tại
//     async logout(req: AuthRequest, res: Response, next: NextFunction) {
//         try {
//             if (!req.user) throw new UnauthorizedError('auth:unauthenticated');

//             // Xóa rf token khỏi redis
//             await redisHelper.del(`refresh_token:${req.user.id}`);

//             return response.noContent(res);
//         } catch (error) {
//             next(error);
//         }
//     },

//     // Lấy thông tin người dùng
//     async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
//         try {
//             // Kiểm tra trạng thái đăng nhập
//             if (!req.user) throw new UnauthorizedError('auth:unauthorized_access');

//             const cacheKey = `user_profile:${req.user.id}`;

//             // Thử lấy profile từ Redis
//             const cachedProfile = await redisHelper.get(cacheKey);
//             if (cachedProfile) {
//                 return response.ok(res, cachedProfile, 'auth:profile_fetched');
//             }

//             // Nếu không có lấy trong db và ghi lại vào redis
//             const user = await authService.getProfile(req.user.id);
//             await redisHelper.set(cacheKey, user, 300);

//             return response.ok(res, user, 'auth:profile_fetched');
//         } catch (error) {
//             next(error);
//         }
//     },

//     async adminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
//         try {
//             if (!req.user) throw new UnauthorizedError('auth:unauthenticated');
//             return response.ok(res, { message: 'Welcome to Admin Dashboard' }, 'auth:admin_access');
//         } catch (error) {
//             next(error);
//         }
//     },

//     async sellerDashboard(req: AuthRequest, res: Response, next: NextFunction) {
//         try {
//             if (!req.user) throw new UnauthorizedError('auth:unauthenticated');
//             return response.ok(res, { message: 'Welcome to Seller Dashboard' }, 'auth:seller_access');
//         } catch (error) {
//             next(error);
//         }
//     },
// };

// export default authController;
