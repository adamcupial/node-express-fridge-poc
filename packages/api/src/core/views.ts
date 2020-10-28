import { ValidationMiddlewareFactory } from './utils/validation';
import type { Fetchable, Listable, Saveable } from '../types/model';
import type { Request, Response } from 'express';
import joi from 'joi';

const paginationSchema = joi.object().keys({
    limit: joi.number().min(1).max(100),
    page: joi.number().min(1),
});

export function PaginatedViewFactory<DataModel>(model: Listable<DataModel>) {
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

const idSchema = joi.object().keys({
    id: joi.number().required(),
})

export function DetailViewFactory<DataModel>(model: Fetchable<DataModel>) {
    return [
        ValidationMiddlewareFactory(idSchema, 'params'),
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const item = await model.getById(parseInt(id, 10));

            if (item === null) {
                res
                    .status(404)
                    .send();
            } else {
                res
                    .status(200)
                    .json(item);
            }
        }
    ]
}


export function AddViewFactory<DataModel>(model: Saveable<DataModel>, schema: joi.Schema) {
    return [
        ValidationMiddlewareFactory(schema, 'body'),
        async(req: Request, res: Response) => {
            const item = await new model(req.body).save();
            res
                .status(200)
                .json(item);
        }
    ]
}