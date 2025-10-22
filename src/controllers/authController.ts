import { UserModel, RoleModel, PermissionModel } from "../models";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { getAccesstoken } from '../utils/getAccesstoken';
import { NotFoundError, UnauthorizedError, ValidationError } from '../exception/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import redisClient from '../config/redisClient';

dotenv.config();

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        where: { email },
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

    if (!user)
        throw new NotFoundError(req.t('auth:user_not_found'));

    const isMatchPassword = await bcrypt.compare(password, (user as any).password);
    if (!isMatchPassword)
        throw new UnauthorizedError(req.t('auth:invalid_credentials'));

    const userRoles = (user as any).roles || [];
    const roleNames = userRoles.map((role: any) => role.name);

    const allPermissions = new Set<string>();
    userRoles.forEach((role: any) => {
        if (role.permissions && role.permissions.length > 0) {
            role.permissions.forEach((permission: any) => {
                allPermissions.add(permission.name);
            });
        }
    });
    const permissionNames = Array.from(allPermissions);

    return res.status(200).json({
        code: 200,
        message: req.t('auth:login_successful'),
        data: {
            user: {
                ...user.toJSON(),
                password: undefined,
            },
            auth: {
                access_token: await getAccesstoken((user as any).id, roleNames, permissionNames, false),
                refresh_token: await getAccesstoken((user as any).id, roleNames, permissionNames, true),
                expires_in: 600,
            }
        }
    });
});

const loginSocial = asyncHandler(async (req: Request, res: Response) => {
    const provider = req.params.provider;
    const { firstname, lastname, email, photoUrl } = req.body;

    let user = await UserModel.findOne({
        where: { email },
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

    if (!user) {
        user = await UserModel.create({
            email,
            firstname: firstname,
            lastname: lastname,
            photoUrl: photoUrl,
            password: null
        });

        user = await UserModel.findOne({
            where: { id: (user as any).id },
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
    }

    if (!user) {
        throw new NotFoundError(req.t('auth:user_not_found'));
    }

    const userRoles = (user as any).roles || [];
    const roleNames = userRoles.map((role: any) => role.name);

    const allPermissions = new Set<string>();
    userRoles.forEach((role: any) => {
        if (role.permissions && role.permissions.length > 0) {
            role.permissions.forEach((permission: any) => {
                allPermissions.add(permission.name);
            });
        }
    });
    const permissionNames = Array.from(allPermissions);

    return res.status(200).json({
        code: 200,
        message: req.t('auth:login_successful'),
        data: {
            user: {
                ...user.toJSON(),
                password: undefined,
            },
            auth: {
                access_token: await getAccesstoken((user as any).id, roleNames, permissionNames, false),
                refresh_token: await getAccesstoken((user as any).id, roleNames, permissionNames, true),
                expires_in: 600,
            }
        }
    });
});

const forgotPasswordVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ where: { email } });
    if (!user)
        throw new NotFoundError(req.t('user:user_not_found'));

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const timeDead = 90;
    const maxAttempts = 5;

    await redisClient.setEx(`reset_password_code:${email}`, timeDead, JSON.stringify({
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

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, code, password } = req.body;

    const resetKey = `reset_password_code:${email}`;
    const resetData = await redisClient.get(resetKey);

    if (!resetData)
        throw new ValidationError(req.t('user:verification_code_expired_or_not_found'));

    const { code: storedCode, attempts_left } = JSON.parse(resetData);

    if (attempts_left <= 0) {
        await redisClient.del(resetKey);
        throw new ValidationError(req.t('user:verification_attempts_exceeded'));
    }

    if (code !== storedCode) {
        const newAttemptsLeft = attempts_left - 1;

        if (newAttemptsLeft <= 0) {
            await redisClient.del(resetKey);
            throw new ValidationError(req.t('user:verification_attempts_exceeded'));
        }

        const ttl = await redisClient.ttl(resetKey);
        await redisClient.setEx(resetKey, ttl > 0 ? ttl : 90, JSON.stringify({
            code: storedCode,
            attempts_left: newAttemptsLeft,
        }));

        throw new ValidationError(req.t('user:verification_code_invalid', { attempts_left: newAttemptsLeft }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.update(
        { password: hashedPassword },
        { where: { email } }
    );

    await redisClient.del(resetKey);

    return successResponse(res, {
        message: req.t('user:password_reset_successfully'),
    });
});

export {
    login,
    loginSocial,
    forgotPasswordVerification,
    resetPassword,
}; 
