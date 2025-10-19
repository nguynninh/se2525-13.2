import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.setGlobalPrefix(appConfig.apiPrefix);

    app.useGlobalInterceptors(new ResponseInterceptor());

    // app.useGlobalFilters(new HttpExceptionFilter());

    // Thiết lập Swagger cho API documentation
    if (appConfig.env === 'development') {
        const config = new DocumentBuilder()
            .setTitle('TMĐT API')
            .setDescription('API cho hệ thống Thương mại điện tử')
            .setVersion('1.0')
            .addBearerAuth()
            .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'ApiKey')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(appConfig.port);
    console.log(`Server running on http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
}
bootstrap();
