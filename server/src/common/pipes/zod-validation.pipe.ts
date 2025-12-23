// Đảm bảo dữ liệu từ client là đúng trước khi đi vào controller
// Ném lỗi 422 với thông tin chi tiết về lỗi, tích hợp với HttpExceptionFilter để chuẩn hóa response

import { UnprocessableEntityException, type PipeTransform } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import type { ZodError } from 'zod';

export function buildZodValidationPipe(): PipeTransform {
    const pipe = createZodValidationPipe({
        createValidationException: (error: ZodError) => {
            const details = error.issues.map((issue) => ({
                path: issue.path?.length ? issue.path.join('.') : '(root)',
                message: issue.message,
                code: issue.code,
            }));
            return new UnprocessableEntityException({
                code: 'VALIDATION_ERROR',
                message: 'Dữ liệu đầu vào không hợp lệ',
                details,
            });
        },
    });

    return pipe as unknown as PipeTransform;
}
