import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../exception/AppError';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('auth:email_required'),
        'string.email': req.t('auth:email_invalid'),
        'any.required': req.t('auth:email_required'),
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': req.t('auth:password_required'),
        'string.min': req.t('auth:password_min_length', { min: 6 }),
        'any.required': req.t('auth:password_required'),
      }),
  });

  const { error } = loginSchema.validate(req.body, { abortEarly: false }); 

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};

export const validateForgotPasswordVerification = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('user:email_required'),
        'string.email': req.t('user:email_invalid'),
        'any.required': req.t('user:email_required'),
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('user:email_required'),
        'string.email': req.t('user:email_invalid'),
        'any.required': req.t('user:email_required'),
      }),
    code: Joi.string()
      .length(4)
      .required()
      .messages({
        'string.empty': req.t('user:verification_code_required'),
        'string.length': req.t('user:verification_code_length', { length: 4 }),
        'any.required': req.t('user:verification_code_required'),
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': req.t('user:password_required'),
        'string.min': req.t('user:password_min_length', { min: 6 }),
        'any.required': req.t('user:password_required'),
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};

export const validateLoginSocial = (req: Request, res: Response, next: NextFunction) => {
  const allowedProviders = ['google', 'facebook'];
  const provider = req.params.provider;

  if (!provider || !allowedProviders.includes(provider)) {
    return next(new ValidationError(req.t('auth:invalid_provider'), [{
      field: 'provider',
      message: req.t('auth:provider_not_supported')
    }]));
  }

  const loginSocialSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': req.t('auth:email_required'),
        'string.email': req.t('auth:email_invalid'),
        'any.required': req.t('auth:email_required'),
      }),
    firstname: Joi.string()
      .min(2)
      .required()
      .messages({
        'string.empty': req.t('auth:firstname_required'),
        'string.min': req.t('auth:firstname_min_length', { min: 2 }),
        'any.required': req.t('auth:firstname_required'),
      }),
    lastname: Joi.string()
      .min(2)
      .required()
      .messages({
        'string.empty': req.t('auth:lastname_required'),
        'string.min': req.t('auth:lastname_min_length', { min: 2 }),
        'any.required': req.t('auth:lastname_required'),
      }),
    photoUrl: Joi.string()
      .uri()
      .optional()
      .allow('')
      .messages({
        'string.uri': req.t('auth:photo_url_invalid'),
      }),
    providerId: Joi.string()
      .optional()
      .messages({
        'string.empty': req.t('auth:provider_id_invalid'),
      }),
  });

  const { error } = loginSocialSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};
