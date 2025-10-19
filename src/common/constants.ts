export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SELLER: 'seller',
} as const;

export const QUEUE_NAMES = {
    ORDER_PROCESSING: 'order-queue',
    EMAIL: 'email-queue',
} as const;

export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
} as const;

export enum AuthType {
    None = 'None',
    Jwt = 'Jwt',
    ApiKey = 'ApiKey',
}

export enum ConditionGuard {
    And = 'And',
    Or = 'Or',
}

export const AUTH_TYPE_KEY = 'authType';
export const ROLES_KEY = 'roles';
