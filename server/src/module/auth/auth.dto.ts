// File này định nghĩa các DTO cho module Auth
// Bao gồm cấu trúc dữ liệu đầu vào/đầu ra cho các hành động xác thực như đăng nhập, đăng nhập xã hội, làm mới token

import { UserResponseDto } from '../user/user.dto';

/*
 * ---------- INPUT DTOs ----------
 */
export interface LoginDto {
    email: string;
    password: string;
}

export interface SocialLoginDto {
    provider: 'google' | 'facebook';
    credential: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResendPasswordDto {
    email: string;
}

export interface ResetVerifyDto {
    code: string;
}

export interface ResetFinalizeDto {
    code: string;
    new_password: string;
    confirm_password: string;
}

/*
 * ---------- OUTPUT DTOs ----------
 */
export interface LoginResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponseDto {
    sub: string;
    accessToken: string;
    refreshToken: string;
}

export type ForgotPasswordResponseDto =
    | { sent: true; ttl: number; windowRemaining: number; rotated: boolean }
    | { sent: false; reason: string; retryAfter?: number; ttlRemaining?: number }
    | { sent: false; reason: string; ttlRemaining: number };

export type ResendPasswordResponseDto = ForgotPasswordResponseDto;

export type VerifyResponseDto = { ok: true; ttl: number; email: string };

export interface ResetFinalizeResponseDto {
    userId: string | null;
    email: string;
}
