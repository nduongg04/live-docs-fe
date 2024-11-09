import { Types } from "mongoose";
import { User } from "../schema/user.schema";

export class CreateAccountDto {
    provider: string;
    providerAccountId: string;
    type: string;
    user: Omit<User, 'accountId'> & { _id: Types.ObjectId };
}
