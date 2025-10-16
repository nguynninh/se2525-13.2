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
    const messages = error.details.map((d) => d.message).join(', ');
    return next(new ValidationError(messages));
  }

  next();
};