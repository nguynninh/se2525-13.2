import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { registerDeviceToken, removeDeviceToken } from './deviceToken.service';
import { RegisterDeviceTokenDto } from './deviceToken.dto';

export const DeviceTokenController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const dto = req.body as RegisterDeviceTokenDto;
            const token = await registerDeviceToken(userId, dto);
            return response.ok(res, token, 'device_token:upsert_success');
        } catch (err) {
            return next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const deviceId = (req.query.deviceId as string) ?? (req.body?.device_id as string | undefined);
            await removeDeviceToken(userId, deviceId);
            return response.ok(res, {}, 'device_token:remove_success');
        } catch (err) {
            return next(err);
        }
    },
};

export default DeviceTokenController;
