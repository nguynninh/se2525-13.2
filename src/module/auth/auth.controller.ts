import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { authRegister, authForgotPassword, authLogin, authLogout, authRefreshToken } from './auth.service';
import { UserRole } from '../../models/User.model';
import {
    LoginDto,
    SocialLoginDto,
    RefreshTokenDto,
    RefreshTokenResponseDto,
    LoginResponseDto,
    ForgotPasswordDto,
} from './auth.dto';
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
            const data: RegisterResendResponse = await authRegister.resend(dto);
            const msg =
                (data as any).sent === true
                    ? 'auth:register_code_resent'
                    : (data as any).reason || 'auth:otp_reset_too_soon';
            return response.ok(res, data, msg);
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

// Controller Login
export const loginController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as LoginDto;
            const data: LoginResponseDto = await authLogin.login(dto);
            return response.ok(res, data, 'auth:login_success');
        } catch (err) {
            next(err);
        }
    },

    async socialLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as SocialLoginDto;
            const data: LoginResponseDto = await authLogin.loginSocial(dto);
            return response.ok(res, data, 'auth:login_success');
        } catch (err) {
            next(err);
        }
    },
};

// Controller Logout
export const logoutController = {
    async logoutOne(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await authLogout.logoutOne(req.body as RefreshTokenDto);
            return response.ok(res, { ok: true }, 'auth:logout_success');
        } catch (err) {
            next(err);
        }
    },
};

// Controller Refresh Token
export const refreshTokenController = {
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as RefreshTokenDto;
            const data: RefreshTokenResponseDto = await authRefreshToken.refreshToken(dto);
            return response.ok(res, data, 'auth:token_refreshed');
        } catch (err) {
            next(err);
        }
    },
};

// Controller Forgot Password
export const forgotPasswordController = {
    async request(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authForgotPassword.request(req.body as ForgotPasswordDto);
            const msg = (data as any).sent ? 'auth:reset_request_sent' : 'auth:reset_in_progress';
            return response.ok(res, data, msg);
        } catch (err) {
            next(err);
        }
    },

    async resend(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authForgotPassword.resend(req.body as { email: string });
            const msg =
                (data as any).sent === true ? 'auth:otp_resent' : (data as any).reason || 'auth:otp_reset_too_soon';
            return response.ok(res, data, msg);
        } catch (err) {
            next(err);
        }
    },

    // POST /auth/reset/verify
    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authForgotPassword.verify(req.body as { code: string });
            return response.ok(res, data, 'auth:otp_valid');
        } catch (err) {
            next(err);
        }
    },

    // POST /auth/reset/finalize
    async finalize(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authForgotPassword.finalize(
                req.body as { code: string; new_password: string; confirm_password: string },
            );
            return response.ok(res, data, 'auth:password_reset_success');
        } catch (err) {
            next(err);
        }
    },
};
