import { IsEmail } from 'class-validator';

export type GoogleUserDto = {
    email: string;
    displayName: string;
};
