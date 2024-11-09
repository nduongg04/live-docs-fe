import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { Account } from './schema/accout.schema';
import { CreateAccountDto } from './dto/create-accout.dto';
import { AVATAR_PLACEHOLDER } from '../constants';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Account.name) private accountModel: Model<Account>,
        private uploadService: UploadService,
    ) {}

    async create(
        createUserDto: CreateUserDto,
        avatarUrl?: string,
        avatar?: Express.Multer.File,
    ) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;

        let updatedAvatarUrl = null;
        if (avatarUrl) {
            updatedAvatarUrl = avatarUrl;
        } else if (avatar && avatar instanceof Object) {
            const updatedAvatar = await this.uploadService.uploadToImageKit(
                avatar.buffer,
                avatar.originalname,
            );
            updatedAvatarUrl = updatedAvatar.url;
        } else {
            updatedAvatarUrl = AVATAR_PLACEHOLDER;
        }
        const createdUser = new this.userModel({
            ...createUserDto,
            avatar: updatedAvatarUrl,
        });
        return createdUser.save();
    }

    async findAll() {
        return this.userModel.find().exec();
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findOneById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async deleteAll() {
        return this.userModel.deleteMany({}).exec();
    }

    async findByIds(ids: string[]) {
        const objectIds = ids
            .map((id) => {
                try {
                    const objectId = new Types.ObjectId(id);
                    return objectId;
                } catch (error) {
                    return null;
                }
            })
            .filter((objectId) => objectId !== null);

        return this.userModel.find({
            _id: {
                $in: objectIds,
            },
        });
    }

    async findByEmails(emails: string[]) {
        return this.userModel.find({
            email: {
                $in: emails,
            },
        });
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        avatar?: Express.Multer.File,
    ) {
        let updatedAvatar = null;
        if (avatar && avatar instanceof Object) {
            updatedAvatar = await this.uploadService.uploadToImageKit(
                avatar.buffer,
                avatar.originalname,
            );
        }
        const updateData: UpdateUserDto & { avatar?: string } = {
            ...updateUserDto,
        };
        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserDto.password,
                10,
            );
            updateData.password = hashedPassword;
        }
        if (updatedAvatar) {
            updateData.avatar = updatedAvatar.url;
        } else {
            delete updateData.avatar;
        }
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async findAccountByProvider(provider: string, providerId: string) {
        return this.accountModel
            .findOne({ provider, providerAccountId: providerId })
            .populate('user')
            .exec();
    }

    async createAccount(createAccountDto: CreateAccountDto) {
        const createdAccount = new this.accountModel(createAccountDto);
        return (await createdAccount.save()).populate('user');
    }
}
