import { UserModel, RoleModel, PermissionModel } from "../models";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import redisClient from "../config/redisClient";
import { NotFoundError, ValidationError } from "../exception/AppError";

dotenv.config();

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, code } = req.body;

    const verifyKey = `verify_user:${email}`;
    const verifyData = await redisClient.get(verifyKey);

    if (!verifyData)
        throw new ValidationError(req.t('user:verification_code_expired_or_not_found'));

    const { code: storedCode, attempts_left } = JSON.parse(verifyData);

    if (attempts_left <= 0) {
        await redisClient.del(verifyKey);
        throw new ValidationError(req.t('user:verification_attempts_exceeded'));
    }

    if (code !== storedCode) {
        const newAttemptsLeft = attempts_left - 1;

        if (newAttemptsLeft <= 0) {
            await redisClient.del(verifyKey);
            throw new ValidationError(req.t('user:verification_attempts_exceeded'));
        }

        const ttl = await redisClient.ttl(verifyKey);
        await redisClient.setEx(verifyKey, ttl > 0 ? ttl : 90, JSON.stringify({
            code: storedCode,
            attempts_left: newAttemptsLeft,
        }));

        throw new ValidationError(req.t('user:verification_code_invalid', { attempts_left: newAttemptsLeft }));
    }

    const newUser = await UserModel.create({ email, password, firstname, lastname });

    const userRole = await RoleModel.findOne({ where: { name: 'user' } });
    if (userRole) {
        await (newUser as any).addRole(userRole);
    }

    await newUser.reload({
        include: [{
            model: RoleModel,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
            include: [{
                model: PermissionModel,
                as: 'permissions',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        }]
    });

    await redisClient.del(verifyKey);

    return successResponse(res, {
        message: req.t('user:user_created_successfully'),
        data: {
            user: {
                ...newUser.toJSON(),
                password: undefined,
            }
        }
    });
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ where: { email } });
    if (user)
        throw new NotFoundError(req.t('user:email_already_in_use'));

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const timeDead = 90;
    const maxAttempts = 5;

    await redisClient.setEx(`verify_user:${email}`, timeDead, JSON.stringify({
        code,
        attempts_left: maxAttempts,
    }));

    return successResponse(res, {
        message: req.t('user:verification_code_sent', { email }),
        data: {
            email,
            ...(process.env.NODE_ENV === 'development' ? { code } : {}),
            expires_in: timeDead,
            attempts_left: maxAttempts,
        }
    });
});

const retrievedUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);
    if (!user)
        throw new NotFoundError(req.t('user:user_not_found'));

    return successResponse(res, {
        message: req.t('user:user_retrieved_successfully'),
        data: {
            user: {
                ...user.toJSON(),
                password: undefined,
            }
        }
    });
});

export {
    createUser,
    verifyUser,
    retrievedUser,
};