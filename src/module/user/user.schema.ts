// schema Joi để validate input cho các endpoint liên quan đến người dùng
// Bao gồm tạo người dùng, cập nhật hồ sơ, xác minh email, và kiểm tra ID

import Joi from 'joi';
import UserRole from '../../models/User.model';

export const userSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'user:email_required',
            'string.email': 'user:email_invalid',
            'any.required': 'user:email_required',
        }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'user:password_required',
        'string.min': 'user:password_min_length',
        'any.required': 'user:password_required',
    }),
    first_name: Joi.string().max(30).required().messages({
        'string.empty': 'user:first_name_required',
        'string.max': 'user:first_name_max_length',
        'any.required': 'user:first_name_required',
    }),
    last_name: Joi.string().max(30).required().messages({
        'string.empty': 'user:last_name_required',
        'string.max': 'user:last_name_max_length',
        'any.required': 'user:last_name_required',
    }),
    code: Joi.string()
        .length(4)
        .pattern(/^[0-9]{4}$/)
        .required()
        .messages({
            'string.empty': 'user:verification_code_required',
            'string.length': 'user:verification_code_length',
            'string.pattern.base': 'user:verification_code_invalid',
            'any.required': 'user:verification_code_required',
        }),
    role: Joi.string()
        .valid(...Object.values(UserRole))
        .required()
        .messages({
            'string.empty': 'user:role_required',
            'any.only': 'user:role_invalid',
        }),
});

export const updateProfileSchema = Joi.object({
    first_name: Joi.string().min(1).max(30).optional(),
    last_name: Joi.string().min(1).max(30).optional(),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional(),
}).min(1);

export const verifySchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'user:email_required',
            'string.email': 'user:email_invalid',
            'any.required': 'user:email_required',
        }),
});

export const idSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
        'string.empty': 'user:user_id_required',
        'string.guid': 'user:user_id_invalid',
        'any.required': 'user:user_id_required',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'auth:email_required',
            'string.email': 'auth:email_invalid',
            'any.required': 'auth:email_required',
        }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'auth:password_required',
        'string.min': 'auth:password_min_length',
        'any.required': 'auth:password_required',
    }),
});

export const loginSocialSchema = Joi.object({
    credential: Joi.string().required().messages({
        'string.empty': 'auth:credential_required',
        'any.required': 'auth:credential_required',
    }),
}).options({ stripUnknown: true });
