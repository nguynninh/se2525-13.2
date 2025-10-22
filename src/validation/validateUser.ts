import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../exception/AppError';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('user:email_required'),
        'string.email': req.t('user:email_invalid'),
        'any.required': req.t('user:email_required'),
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': req.t('user:password_required'),
        'string.min': req.t('user:password_min_length', { min: 6 }),
        'any.required': req.t('user:password_required'),
      }),
    firstname: Joi.string()
        .max(30)
        .required()
        .messages({
            'string.empty': req.t('user:first_name_required'),
            'string.max': req.t('user:first_name_max_length', { max: 30 }),
            'any.required': req.t('user:first_name_required'),
        }),
    lastname: Joi.string()
        .max(30)
        .required()
        .messages({
            'string.empty': req.t('user:last_name_required'),
            'string.max': req.t('user:last_name_max_length', { max: 30 }),
            'any.required': req.t('user:last_name_required'),
        }),
    code: Joi.string()
        .length(4)
        .required()
        .messages({
            'string.empty': req.t('user:verification_code_required'),
            'string.length': req.t('user:verification_code_length', { length: 4 }),
            'any.required': req.t('user:verification_code_required'),
        }),
  });

  const { error } = userSchema.validate(req.body, { abortEarly: false }); 

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};

export const validateVerifyUser = (req: Request, res: Response, next: NextFunction) => {
  const verifySchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('user:email_required'),
        'string.email': req.t('user:email_invalid'),
        'any.required': req.t('user:email_required'),
      }),
  });

  const { error } = verifySchema.validate(req.body, { abortEarly: false }); 

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.empty': req.t('user:user_id_required'),
        'string.guid': req.t('user:user_id_invalid'),
        'any.required': req.t('user:user_id_required'),
      }),
  });

  const { error } = idSchema.validate(req.params, { abortEarly: false }); 

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};