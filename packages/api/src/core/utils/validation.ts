import type { Schema } from 'joi';
import type { Request, Response, NextFunction } from 'express';

type where = 'body' | 'params' | 'query';


export function ValidationMiddlewareFactory(schema: Schema, where: where = 'params') {
    return (req: Request, res: Response, next: NextFunction) => {
        const results = schema.validate(req[where]);
        const { error, value } = results;

        if (error === undefined) {
            req[where] = value;
            next();
        } else {
            const message = error.details.map(x => x.message);
            res
                .status(422)
                .json({
                    error: 'ValidationError',
                    message,
                });
        }
    }
}