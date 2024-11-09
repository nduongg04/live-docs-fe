import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        // what is this function
        // this function is called when the token is valid
        // the payload is the decoded token
        // you can retrieve additional information from the token
        // you can use this data to find the user in the database
        // this data will be attached to the request object
        return { _id: payload.sub, email: payload.email };
    }
}
