import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class OAuthCallbackDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    idToken?: string;

    @IsString()
    @IsNotEmpty()
    provider: string;

    @IsObject()
    @IsNotEmpty()
    profile: any;
}
