import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';
import { RegisterDeviceTokenSchema, RemoveDeviceTokenQuerySchema } from '../../../module/deviceToken/deviceToken.schema';
import DeviceTokenController from '../../../module/deviceToken/deviceToken.controller';

const router = Router();

router.post(
    '/user/me/device-tokens',
    authenticate,
    v({ body: RegisterDeviceTokenSchema }),
    DeviceTokenController.register,
);

router.delete(
    '/user/me/device-tokens',
    authenticate,
    v({ query: RemoveDeviceTokenQuerySchema }),
    DeviceTokenController.remove,
);

export default router;
