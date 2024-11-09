import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request } from 'express';
import { Public } from 'src/decorators/public-auth.decorator';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<IKResponse<UploadResponse>> {
        // console.log('File:', file);
        return this.uploadService.uploadToImageKit(
            file.buffer,
            file.originalname,
        );
    }
}
