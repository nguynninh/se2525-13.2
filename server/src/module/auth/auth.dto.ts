// File này định nghĩa các DTO cho module Auth
// Bao gồm cấu trúc dữ liệu đầu vào/đầu ra cho các hành động xác thực như đăng nhập, đăng nhập xã hội, làm mới token

import { UserResponseDto } from '../user/user.dto';

// DTO cho dữ liệu đầu vào khi đăng nhập
export interface LoginDto {
    email: string;
    password: string;
}

// DTO cho dữ liệu đầu vào khi đăng nhập qua mạng xã hội
export interface SocialLoginDto {
    provider: 'google' | 'facebook';
    credential: string;
}

// DTO cho dữ liệu đầu vào khi làm mới token
export interface RefreshTokenDto {
    refreshToken: string;
}

// DTO cho dữ liệu đầu ra khi đăng nhập hoặc làm mới token
export interface AuthResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}

// DTO cho dữ liệu đầu ra khi làm mới token
export interface RefreshTokenResponseDto {
    id: string;
    accessToken: string;
}
