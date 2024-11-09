import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class DuplicateExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception.code === 11000) {
            // Handle duplicate key error
            response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Email is already registered.',
            });
        } else {
            console.log('MongoError', exception);
            // Handle other MongoDB errors
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            });
        }
    }
}
