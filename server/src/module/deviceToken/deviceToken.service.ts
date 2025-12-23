import { DeviceToken } from '../../models/DeviceToken.model';
import { RegisterDeviceTokenDto, DeviceTokenDto } from './deviceToken.dto';
import { ValidationError } from '../../exception/AppError';

const mapToken = (t: DeviceToken): DeviceTokenDto => ({
    id: t.id,
    user_id: t.user_id,
    device_id: t.device_id ?? '',
    platform: t.platform,
    push_token: t.push_token,
    app_version: t.app_version ?? null,
    os_version: t.os_version ?? null,
    is_active: Boolean(t.is_active),
    last_used_at: t.last_used_at,
    created_at: t.created_at,
    updated_at: t.updated_at,
});

export const registerDeviceToken = async (userId: string, dto: RegisterDeviceTokenDto): Promise<DeviceTokenDto> => {
    const now = new Date();
    const existing = await DeviceToken.findOne({
        where: {
            user_id: userId,
            device_id: dto.device_id,
            platform: dto.platform,
        },
    });

    if (existing) {
        existing.push_token = dto.push_token;
        existing.app_version = dto.app_version ?? null;
        existing.os_version = dto.os_version ?? null;
        existing.is_active = true;
        existing.last_used_at = now;
        await existing.save();
        return mapToken(existing);
    }

    const created = await DeviceToken.create({
        user_id: userId,
        device_id: dto.device_id,
        platform: dto.platform,
        push_token: dto.push_token,
        app_version: dto.app_version ?? null,
        os_version: dto.os_version ?? null,
        is_active: true,
        last_used_at: now,
    });

    return mapToken(created);
};

export const removeDeviceToken = async (userId: string, deviceId?: string | null): Promise<void> => {
    if (!deviceId) {
        throw new ValidationError('device_token:device_id_required');
    }

    const token = await DeviceToken.findOne({
        where: { user_id: userId, device_id: deviceId },
    });

    if (!token) {
        return;
    }

    token.is_active = false;
    token.last_used_at = new Date();
    await token.save();
};
