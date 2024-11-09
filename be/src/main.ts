import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.enableCors({});
    await app.listen(4000);
}
bootstrap();
