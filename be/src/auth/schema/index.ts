import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
// schema for refresh token
export class RefreshToken {
    // user id
    @Prop()
    userId: string;

    // refresh token
    @Prop()
    refreshToken: string;

    // expiration date
    @Prop()
    expires: Date;
}
