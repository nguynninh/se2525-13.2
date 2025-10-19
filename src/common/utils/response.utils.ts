// Format response thống nhất cho TMĐT API.

export interface ResponseFormat<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: { total: number; page: number; limit: number };
    error?: any;
}

export class ResponseUtils {
    /**
     * Format response thành { success, data, message, meta, error }
     * @param data Dữ liệu chính
     * @param options Tùy chọn bổ sung (message, meta, error)
     * @returns ResponseFormat
     */
    static formatResponse<T>(
        data: T | { data: T; total: number; page: number; limit: number },
        options: Partial<ResponseFormat<T>> = {},
    ): ResponseFormat<T> {
        const isPaginated = data && typeof data === 'object' && 'data' in data && 'total' in data;
        return {
            success: true,
            data: isPaginated ? (data as any).data : data,
            message: options.message || 'Thành công',
            ...(isPaginated && {
                meta: { total: (data as any).total, page: (data as any).page, limit: (data as any).limit },
            }),
            ...(options.error && { error: options.error }),
        };
    }
}
