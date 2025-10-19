// Module chính của ứng dụng
// Kết nối các module và thiết lập TypeORM

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { bullmqConfig } from './config/bullmq.config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(databaseConfig),
        JwtModule.register({
            secret: jwtConfig.accessSecret,
            signOptions: { expiresIn: jwtConfig.accessExpiresIn },
        }),
        BullModule.forRootAsync({
            useFactory: () => bullmqConfig,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
