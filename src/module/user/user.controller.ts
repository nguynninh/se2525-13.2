import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import {
    getMe,
    updateMe,
    changePassword,
    updateAvatar,
    deleteMe,
    // adminListSellers,
    adminUpdateSellerStatus,
    adminDeleteSeller,
    adminDeleteUser,
    getSellerMe,
    adminListUsers,
    adminGetUserFullDetail,
} from './user.service';
import {
    UserResponseDto,
    UpdateMeDto,
    ChangePasswordDto,
    SellerWithUserResponseDto,
    SellerResponseDto,
    AdminUserDetailResponseDto,
    ListUsersQueryDto,
    MeResponseDto,
} from './user.dto';
import { ValidationError } from '../../exception/AppError';
import { uploadFileToMinIO } from '../../utils/upload';

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const result: MeResponseDto = await getMe(userId);
        return response.ok(res, result, 'user:get_me_successfully');
    } catch (err) {
        next(err);
    }
};

export const updateMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const dto = req.body as UpdateMeDto;

        const result: UserResponseDto = await updateMe(userId, dto);
        return response.ok(res, result, 'user:update_me_successfully');
    } catch (err) {
        next(err);
    }
};

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const { current_password, new_password } = req.body as {
            current_password: string;
            new_password: string;
            confirm_password: string;
        };

        const dto: ChangePasswordDto = {
            current_password,
            new_password,
        };

        await changePassword(userId, dto);

        return response.ok(res, null, 'user:change_password_successfully');
    } catch (err) {
        next(err);
    }
};

export const updateAvatarController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const file = req.file as Express.Multer.File | undefined;
        if (!file) {
            throw new ValidationError('user:file_required');
        }

        const sanitizedName = file.originalname.replace(/\s+/g, '_');

        // uploads/avatars trong bucket
        const profileUrl = await uploadFileToMinIO(sanitizedName, file.buffer, file.mimetype, 'uploads/avatars');

        const result: UserResponseDto = await updateAvatar(userId, profileUrl);

        return response.ok(res, result, 'user:update_avatar_successfully');
    } catch (err) {
        next(err);
    }
};

export const deleteMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        await deleteMe(userId);

        return response.ok(res, null, 'user:delete_me_successfully');
    } catch (err) {
        next(err);
    }
};

// export const adminListSellersController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const rawStatus = req.query.status;
//         let status: SellerStatusDto | undefined = undefined;

//         if (typeof rawStatus === 'string') {
//             if (rawStatus === 'active' || rawStatus === 'suspended' || rawStatus === 'closed') {
//                 status = rawStatus;
//             } else {
//                 throw new ValidationError('user:invalid_status_filter');
//             }
//         }

//         const result: SellerWithUserResponseDto[] = await adminListSellers({ status });
//         return response.ok(res, result, 'user:get_sellers_successfully');
//     } catch (err) {
//         next(err);
//     }
// };

export const adminListUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, search } = req.query as { role?: string; search?: string };

        let roleFilter: 'customer' | 'seller' | 'admin' | undefined;

        if (role) {
            if (role === 'customer' || role === 'seller' || role === 'admin') {
                roleFilter = role;
            } else {
                throw new ValidationError('user:invalid_role_filter');
            }
        }

        const params: ListUsersQueryDto = {
            role: roleFilter,
            search: search?.trim() || undefined,
        };

        const result: UserResponseDto[] = await adminListUsers(params);

        return response.ok(res, result, 'user:get_me_successfully');
    } catch (err) {
        next(err);
    }
};

export const adminGetUserFullDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            throw new ValidationError('user:id_required');
        }

        const result: AdminUserDetailResponseDto = await adminGetUserFullDetail(userId);

        return response.ok(res, result, 'user:get_user_successfully');
    } catch (err) {
        next(err);
    }
};

export const adminUpdateSellerStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.params.id;
        if (!sellerId) {
            throw new ValidationError('user:seller_id_required');
        }

        const { status } = req.body as { status: 'active' | 'suspended' | 'closed' };

        const result: SellerResponseDto = await adminUpdateSellerStatus(sellerId, status);

        return response.ok(res, result, 'user:update_seller_status_successfully');
    } catch (err) {
        next(err);
    }
};

export const adminDeleteSellerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.params.id;
        if (!sellerId) {
            throw new ValidationError('user:seller_id_required');
        }

        await adminDeleteSeller(sellerId);

        return response.ok(res, null, 'user:delete_seller_successfully');
    } catch (err) {
        next(err);
    }
};

export const adminDeleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            throw new ValidationError('user:seller_id_required');
        }

        await adminDeleteUser(userId);

        return response.ok(res, null, 'user:delete_me_successfully');
    } catch (err) {
        next(err);
    }
};

// Lấy thông tin seller từ người dùng
export const getSellerMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        if (role !== 'seller') {
            throw new ValidationError('user:seller_not_found');
        }

        const result: SellerWithUserResponseDto = await getSellerMe(userId);

        return response.ok(res, result, 'user:get_me_successfully');
    } catch (err) {
        next(err);
    }
};
