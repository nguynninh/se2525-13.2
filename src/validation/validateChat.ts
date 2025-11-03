import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../exception/AppError';

export const validateInternalAI = (req: Request, res: Response, next: NextFunction) => {
  const validateInternalAISchema = Joi.object({
    message: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.empty': req.t('chat:message_required'),
        'string.min': req.t('chat:message_min_length', { min: 1 }),
        'any.required': req.t('chat:message_required'),
      }),
  });

  const { error } = validateInternalAISchema.validate(req.body, { abortEarly: false }); 

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return next(new ValidationError(req.t('common:validation_error'), errors));
  }

  next();
};