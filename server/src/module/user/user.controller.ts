import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { getMe, updateMe, changePassword, updateAvatar, deleteMe } from './user.service';
import { UserResponseDto, UpdateMeDto, ChangePasswordDto } from './user.dto';
import { ValidationError } from '../../exception/AppError';
import { uploadFileToMinIO } from '../../utils/upload';

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const result: UserResponseDto = await getMe(userId);
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
