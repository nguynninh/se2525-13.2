import { BullRootModuleOptions } from '@nestjs/bullmq';
import { redisConfig } from './redis.config';

export const bullmqConfig: BullRootModuleOptions = {
    connection: redisConfig,
};
