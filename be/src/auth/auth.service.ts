import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import {
    UserDocument,
    UserJwtDto,
    UserWithId,
    UserWithoutPassword,
} from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { removePasswordField } from 'utils';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            throw new UnauthorizedException('Invalid password');
        }
        return removePasswordField(user.toObject());
    }

    async generateTokenPair(user: UserJwtDto) {
        return {
            access_token: await this.generateAccessToken(user),
            refresh_token: await this.generateRefreshToken(user),
        };
    }

    async login(userInfo: UserWithoutPassword) {
        return {
            ...(await this.generateTokenPair(userInfo)),
            user: userInfo,
        };
    }

    async register(createUserDto: CreateUserDto, avatar?: Express.Multer.File) {
        const existingUser = await this.usersService.findOneByEmail(
            createUserDto.email,
        );
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        const createdUser = await this.usersService.create(
            createUserDto,
            null,
            avatar,
        );
        return {
            ...(await this.generateTokenPair(createdUser)),
            user: removePasswordField(createdUser.toObject()),
        };
    }

    async validateGoogleUser(profile: Profile) {
        const user = await this.usersService.findOneByEmail(
            profile.emails[0].value,
        );
        if (user) {
            return removePasswordField(user.toObject());
        }
        console.log('Creating user');
        const createdUser = await this.usersService.create(
            {
                email: profile.emails[0].value,
                displayName: profile.displayName,
                password: '',
            },
            profile.photos[0].value,
        );
        return removePasswordField(createdUser.toObject());
    }

    async validateOAuthLogin(profile: any, provider: string) {
        let userProfile: {
            email: string;
            displayName: string;
            avatar: string;
            providerId: string;
        };
        switch (provider) {
            case 'google':
                userProfile = {
                    email: profile.email,
                    displayName: profile.name,
                    avatar: profile.picture,
                    providerId: profile.sub,
                };
                break;
            case 'facebook':
                userProfile = {
                    email: profile.email,
                    displayName: profile.name,
                    avatar: profile.picture.data.url,
                    providerId: profile.id,
                };
                break;
            default:
                throw new BadRequestException(
                    `Unsupported provider: ${provider}`,
                );
        }
        let user: UserWithId;
        const existingAccount = await this.usersService.findAccountByProvider(
            provider,
            userProfile.providerId,
        );
        if (existingAccount) {
            user = existingAccount.user.toObject();
        } else {
            user = (
                await this.usersService.findOneByEmail(userProfile.email)
            )?.toObject();

            if (!user) {
                user = (
                    await this.usersService.create(
                        {
                            email: userProfile.email,
                            displayName: userProfile.displayName,
                            password: Math.random()
                                .toString(36)
                                .substring(2, 15),
                        },
                        userProfile.avatar,
                    )
                ).toObject();
            }

            await this.usersService.createAccount({
                provider,
                providerAccountId: userProfile.providerId,
                type: 'oauth',
                user: {
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    password: user.password,
                },
            });
        }

        return {
            ...(await this.generateTokenPair({
                email: user.email,
                _id: user._id,
            })),
            user: removePasswordField(user),
        };
    }

    async generateAccessToken(user: UserJwtDto) {
        const payload = { email: user.email, sub: user._id.toString() };
        return await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    async generateRefreshToken(user: UserJwtDto) {
        const payload = { email: user.email, sub: user._id.toString() };
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        });
    }
}
