// Chuẩn hóa định dạng response JSON cho tất cả API RESTful
// Dùng ResponseUtils để format response thành { success, data, message, meta, error }

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: { total: number; page: number; limit: number };
    error?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
        return next.handle().pipe(
            map((data) => {
                const isPaginated = data && 'data' in data && 'meta' in data;
                return {
                    success: true,
                    data: isPaginated ? data.data : data,
                    message: 'Thành công',
                    ...(isPaginated && { meta: { total: data.total, page: data.page, limit: data.limit } }),
                };
            }),
        );
    }
}
