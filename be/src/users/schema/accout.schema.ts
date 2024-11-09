import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Schema()
export class Account {
    @Prop({ required: true })
    provider: string;

    @Prop({ required: true })
    providerAccountId: string;

    @Prop({ required: true })
    type: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: UserDocument;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
