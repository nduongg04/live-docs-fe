import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post('delete-all')
    deleteAll() {
        return this.usersService.deleteAll();
    }

    @HttpCode(HttpStatus.OK)
    @Post('ids')
    findByIds(@Body('ids') ids: string[]) {
        return this.usersService.findByIds(ids);
    }

    @HttpCode(HttpStatus.OK)
    @Post('find/emails')
    findByEmails(@Body('emails') emails: string[]) {
        return this.usersService.findByEmails(emails);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update')
    @UseInterceptors(FileInterceptor('avatar'))
    async update(
        @Request() req: any,
        @Body() body: any,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        const updateUserDto: UpdateUserDto = {
            displayName: body.displayName,
            password: body.password,
            email: body.email,
        };

        return this.usersService.update(req.user._id, updateUserDto, avatar);
    }
}
