// định nghĩa các DTO cho module User
// Bao gồm cấu trúc dữ liệu đầu vào/đầu ra cho các hành động như tạo, cập nhật, và lấy thông tin người dùng

import { UserRole } from '../../models/User.model';

/*
 * ---------- INPUT DTOs ----------
 */
export interface RegisterStartDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface RegisterResendDto {
    email: string;
}

export interface RegisterFinalizeDto {
    code: string;
}

/*
 * ---------- OUTPUT DTOs ----------
 */
export type RegisterStartResponse =
    | { sent: true; ttl: number; windowRemaining: number; rotated: boolean }
    | { sent: false; reason: string; ttlRemaining: number }
    | { sent: false; reason: string; retryAfter: number };

export type RegisterResendResponse = RegisterStartResponse;

export interface UserResponseDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    profile_url?: string | null;
}

export type RegisterFinalizeResponse = UserResponseDto;

export interface UpdateUserDto {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
}

export interface VerifyUserDto {
    email: string;
}

export interface UserIdDto {
    id: string;
}
