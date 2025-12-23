import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants';

export class ErrorUtils {
    static createHttpException(
        message: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        code: string = ERROR_CODES.VALIDATION_ERROR,
    ): HttpException {
        return new HttpException({ message, code }, status);
    }

    static formatError(error: any): { message: string; code: string; status: number } {
        if (error instanceof HttpException) {
            return {
                message: error.message,
                code: error.getResponse()['code'] || ERROR_CODES.VALIDATION_ERROR,
                status: error.getStatus(),
            };
        }
        return {
            message: error.message || 'Lỗi không xác định',
            code: ERROR_CODES.VALIDATION_ERROR,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
}
