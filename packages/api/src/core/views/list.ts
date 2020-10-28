import joi from 'joi';
import { ValidationMiddlewareFactory } from '../utils/validation';
import type { Iterable } from '../../types/model';
import { Request, Response } from 'express';

const paginationSchema = joi.object().keys({
    limit: joi.number().min(1).max(100),
    page: joi.number().min(1),
});

export function PaginatedViewFactory<DataModel>(model: Iterable<DataModel>) {
    return [
        ValidationMiddlewareFactory(paginationSchema, 'query'),
        async (req: Request, res: Response) => {
            let { limit = 10, page = 1 } = req.query;
            limit = parseInt(limit as string, 10);
            page = parseInt(page as string, 10)
            const [count, items] = await Promise.all([model.getTotal(), model.getAll(limit, page)]);
            res
                .header({'x-total': count})
                .status(items.length > 0 ? 200 : 204)
                .json(items);
        }
    ];
}
