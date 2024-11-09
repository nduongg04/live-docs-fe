import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string) {
        // what is this function?
        // this function is called when the user is logging in
        // you can retrieve additional information from the user
        // you can use this data to find the user in the database
        // you can use this data to validate the user's password
        // if the user is valid, return the user
        // if the user is not valid, return null
        return this.authService.validateUser(email, password);
    }
}
