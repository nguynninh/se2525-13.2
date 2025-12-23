// Chuẩn hóa định dạng lỗi cho tất cả lỗi HTTP trong API.
// Xử lý HttpException, trả về response lỗi với cấu trúc { success, error, data, timestamp, path }

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    constructor(private configService: ConfigService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const isDev = this.configService.get('NODE_ENV') === 'development';

        // Log chi tiết lỗi
        this.logger.error({
            status,
            path: request.url,
            method: request.method,
            message: exception.message,
            name: exception.name,
            stack: isDev ? exception.stack : undefined,
        });

        response.status(status).json({
            success: false,
            error: {
                code: exception.name || 'ERROR',
                message: exception.message,
                ...(isDev && { stack: exception.stack }),
            },
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}

// Ví du:
// {
//   "success": false,
//   "error": {
//     "code": "BadRequestException",
//     "message": "Email đã tồn tại",
//     "stack": "...chỉ hiện ở dev..."
//   },
//   "data": null,
//   "timestamp": "2025-10-17T12:34:56.789Z",
//   "path": "/auth/register"
// }
