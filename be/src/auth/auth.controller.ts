import {
	BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UploadedFile,
    UseFilters,
    UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { DuplicateExceptionFilter } from 'src/exception_filters/email-mongo-exception.filter';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from '../decorators/public-auth.decorator';
import { AuthService } from './auth.service';
import { OAuthCallbackDto } from './dto/oauth-callback.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @Public()
    @UseFilters(DuplicateExceptionFilter)
    @UseInterceptors(FileInterceptor('avatar'))
    async register(
        @Body() body,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        const createUserDto: CreateUserDto = {
            email: body.email,
            displayName: body.displayName,
            password: body.password,
        };
        if (
            !createUserDto.email ||
            !createUserDto.password ||
            !createUserDto.displayName
        ) {
            throw new BadRequestException(
                'Email, password and displayName are required',
            );
        }
        return this.authService.register(createUserDto, avatar);
    }

    @Get('profile')
    async profile(@Request() req) {
        return req.user;
    }

    @Get('google/login')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}

    @Post('google/callback')
    @Public()
    async googleCallback(@Body() oauthCallbackDto: OAuthCallbackDto) {
        const returnedValue = await this.authService.validateOAuthLogin(
            oauthCallbackDto.profile,
            oauthCallbackDto.provider,
        );
        console.log(returnedValue);
        return returnedValue;
    }

    @Post('refresh')
    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(@Request() req) {
        return {
            access_token: await this.authService.generateAccessToken(req.user),
        };
    }
}
