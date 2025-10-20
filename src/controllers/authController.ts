import { UserModel, RoleModel, PermissionModel } from "../models";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { getAccesstoken } from '../utils/getAccesstoken';
import { NotFoundError, UnauthorizedError } from '../exception/AppError';
import { asyncHandler } from '../utils/asyncHandler';

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

export {
    login,
    loginSocial,
};