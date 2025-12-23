import { User } from '../../models/User.model';
import { UserResponseDto, UpdateMeDto, ChangePasswordDto } from './user.dto';
import { NotFoundError, ValidationError } from '../../exception/AppError';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
};

const hashPassword = async (plain: string): Promise<string> => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};

export const getMe = async (userId: string): Promise<UserResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
    };
};

export const updateMe = async (userId: string, dto: UpdateMeDto): Promise<UserResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    if (dto.first_name !== undefined) user.first_name = dto.first_name;
    if (dto.last_name !== undefined) user.last_name = dto.last_name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.profile_url !== undefined) user.profile_url = dto.profile_url;

    await user.save();

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
    };
};

export const changePassword = async (userId: string, dto: ChangePasswordDto): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    const isMatch = await comparePassword(dto.current_password, user.password);
    if (!isMatch) {
        throw new ValidationError('auth:password_incorrect');
    }

    const newHashed = await hashPassword(dto.new_password);
    user.password = newHashed;
    await user.save();
};

export const updateAvatar = async (userId: string, profileUrl: string): Promise<UserResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    user.profile_url = profileUrl;
    await user.save();

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
    };
};

export const deleteMe = async (userId: string): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    await user.destroy();
};
