import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RemovePasswordMiddleware } from './middlewares/remove-password.middleware';
import { UploadModule } from './upload/upload.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UsersModule,
        MongooseModule.forRoot(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
        }),
        UploadModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RemovePasswordMiddleware).forRoutes('users');
    }
}
