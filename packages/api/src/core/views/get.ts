import joi from 'joi';
import { ValidationMiddlewareFactory } from '../utils/validation';
import type { Indexable } from '../../types/model';
import { Request, Response } from 'express';

const idSchema = joi.object().keys({
    id: joi.number().required(),
})

export function DetailViewFactory<DataModel>(model: Indexable<DataModel>) {
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