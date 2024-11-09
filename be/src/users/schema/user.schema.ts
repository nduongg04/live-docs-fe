import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserWithId = User & { _id: Types.ObjectId };
export type UserJwtDto = Pick<UserWithId, 'email' | '_id'>;
export type UserWithoutPassword = Omit<UserWithId, 'password'>;

@Schema()
export class User {
    @Prop({
        required: [true, 'Email is required'],
        unique: true,
    })
    email: string;

    @Prop({
        default: '',
    })
    password: string;

    @Prop()
    displayName: string;

    @Prop()
    avatar: string;

    @Prop()
    accountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
