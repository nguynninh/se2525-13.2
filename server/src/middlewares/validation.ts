import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../exception/AppError';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((d) => ({
                field: d.path.join('.'),
                message: req.t(d.message),
            }));
            return next(new ValidationError(req.t('validation:validation_error'), errors));
        }
        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            const errors = error.details.map((d) => ({
                field: d.path.join('.'),
                message: req.t(d.message),
            }));
            return next(new ValidationError(req.t('validation:validation_error'), errors));
        }
        next();
    };
};
