import { HttpException, Injectable } from '@nestjs/common';
import ImageKit = require('imagekit');
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
@Injectable()
export class UploadService {
    async uploadToImageKit(
        fileBuffer: Buffer,
        fileName: string,
    ): Promise<IKResponse<UploadResponse>> {
        const imagekit = new ImageKit({
            publicKey: 'public_WM4/+/q5D5zsCt1Dd/dQIIRqyqY=',
            privateKey: 'private_XemWZUQQ6MgU/xllJQuJ1BE/9KA=',
            urlEndpoint: 'https://ik.imagekit.io/ld11jn6uv/',
        });
        try {
            const result = await imagekit.upload({
                file: fileBuffer,
                fileName: fileName,
            });
            return result;
        } catch (error) {
            throw new HttpException(error.message, 500);
        }
    }
}
