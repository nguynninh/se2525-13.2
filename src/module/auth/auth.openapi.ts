import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
    RegisterStartSchema,
    RegisterResendSchema,
    RegisterFinalizeSchema,
    LoginSchema,
    SocialLoginSchema,
    RefreshTokenSchema,
    ResetRequestSchema,
    ResetVerifySchema,
    ResetFinalizeSchema,
    UserResponseSchema,
    LoginResponseSchema,
    TokenResponseSchema,
    ResetResendSchema,
    ResetResponseSchema,
} from './auth.schema';

export const registerAuthOpenApi = (registry: OpenAPIRegistry) => {
    // POST api/auth/register/start
    registry.registerPath({
        method: 'post',
        path: '/api/auth/register/start',
        tags: ['Auth'],
        summary: 'Bắt đầu đăng ký (gửi OTP về email)',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: RegisterStartSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Tạo phiên đăng ký và gửi OTP thành công',
            },
            400: { description: 'Validation error' },
            409: { description: 'Email đã tồn tại' },
        },
    });

    // POST /api/auth/register/resend
    registry.registerPath({
        method: 'post',
        path: '/api/auth/register/resend',
        tags: ['Auth'],
        summary: 'Gửi lại OTP đăng ký',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: RegisterResendSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Gửi lại OTP thành công',
            },
            400: { description: 'Validation error' },
            404: { description: 'Không tìm thấy phiên đăng ký / email' },
        },
    });

    // POST /api/auth/register/finalize
    registry.registerPath({
        method: 'post',
        path: '/api/auth/register/finalize',
        tags: ['Auth'],
        summary: 'Hoàn tất đăng ký bằng OTP',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: RegisterFinalizeSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Xác thực OTP và tạo tài khoản thành công ',
                content: {
                    'application/json': {
                        schema: UserResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error / OTP sai' },
            404: { description: 'Không tìm thấy phiên đăng ký' },
        },
    });

    // POST api/auth/login
    registry.registerPath({
        method: 'post',
        path: '/api/auth/login',
        tags: ['Auth'],
        summary: 'Đăng nhập bằng email và mật khẩu',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: LoginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đăng nhập thành công, trả về access & refresh token',
                content: {
                    'application/json': {
                        schema: LoginResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Sai email hoặc mật khẩu' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: 'api/auth/login/social/:provider/',
        tags: ['Auth'],
        summary: 'Đăng nhập bằng tài khoản mạng xã hội (Google/Facebook)',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: SocialLoginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đăng nhập social thành công, trả về access & refresh token',
                content: {
                    'application/json': {
                        schema: LoginResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error / credential không hợp lệ' },
        },
    });

    // POST api/auth/refresh
    registry.registerPath({
        method: 'post',
        path: '/api/auth/refresh',
        tags: ['Auth'],
        summary: 'Lấy access token mới bằng refresh token',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: RefreshTokenSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Refresh token hợp lệ, trả về bộ token mới',
                content: {
                    'application/json': {
                        schema: TokenResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Refresh token không hợp lệ hoặc hết hạn' },
        },
    });

    // POST api/auth/reset/request
    registry.registerPath({
        method: 'post',
        path: '/api/auth/reset/request',
        tags: ['Auth'],
        summary: 'Yêu cầu đặt lại mật khẩu (gửi OTP về email)',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ResetRequestSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Gửi OTP reset password thành công',
            },
            400: { description: 'Validation error' },
            404: { description: 'Không tìm thấy email' },
        },
    });

    // POST api/auth/reset/resend
    registry.registerPath({
        method: 'post',
        path: '/api/auth/reset/resend',
        tags: ['Auth'],
        summary: 'Gửi lại OTP reset password',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ResetResendSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Gửi lại otp thành công ',
            },
            400: { description: 'Validation error / OTP sai' },
            404: { description: 'Không tìm thấy phiên reset' },
        },
    });

    // POST api/auth/reset/verify
    registry.registerPath({
        method: 'post',
        path: '/api/auth/reset/verify',
        tags: ['Auth'],
        summary: 'Xác thực OTP reset password',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ResetVerifySchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'OTP hợp lệ ',
            },
            400: { description: 'Validation error / OTP sai' },
            404: { description: 'Không tìm thấy phiên reset' },
        },
    });

    // POST api/auth/reset/finalize
    registry.registerPath({
        method: 'post',
        path: '/api/auth/reset/finalize',
        tags: ['Auth'],
        summary: 'Hoàn tất đặt lại mật khẩu bằng OTP',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ResetFinalizeSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đặt lại mật khẩu thành công (không mô tả body chi tiết)',
                content: {
                    'application/json': {
                        schema: ResetResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error / OTP sai' },
            404: { description: 'Không tìm thấy phiên reset' },
        },
    });

    // POST api/auth/logout
    registry.registerPath({
        method: 'post',
        path: '/api/auth/logout',
        tags: ['Auth'],
        summary: 'Đăng xuất một phiên',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: RefreshTokenSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đăng xuất thành công',
            },
        },
    });
};
