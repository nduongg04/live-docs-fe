import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RemovePasswordMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const originalSend = res.send;
        res.send = function (body) {
            if (Array.isArray(body)) {
                body = body.map((user) => {
                    const { password, ...rest } = user;
                    return rest;
                });
            } else if (body && typeof body === 'object') {
                const { password, ...rest } = body;
                body = rest;
            }
            return originalSend.call(this, body);
        };
        next();
    }
}
