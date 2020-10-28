import joi from 'joi';
import { ValidationMiddlewareFactory } from '../utils/validation';
import type { PersistableIndexable, SchemedPersistableIndexable, PersistableInstance, DataModel } from '../../types/model';
import { Request, Response } from 'express';

const idSchema = joi.object().keys({
    id: joi.number().required(),
});

export function PatchViewFactory<DataModel>(model: SchemedPersistableIndexable<DataModel>): any;
export function PatchViewFactory<DataModel>(model: PersistableIndexable<DataModel>, schema:joi.Schema): any;
export function PatchViewFactory<DataModel>(model: PersistableIndexable<DataModel> | SchemedPersistableIndexable<DataModel>, schema?:joi.Schema): any {
    let validationMw;
    if (schema) {
        validationMw = ValidationMiddlewareFactory(schema, 'body');
    } else if ('getSchema' in model) {
        validationMw = ValidationMiddlewareFactory(model.getSchema(true), 'body');
    }

    return [
        ValidationMiddlewareFactory(idSchema, 'params'),
        validationMw,
        async(req: Request, res: Response) => {
            const id = parseInt(req.params.id, 10);
            const item = await model.getById(id);
            const data = Object.fromEntries(
                Object.entries(req.body)
                .filter(([x, ]) => x !== 'id')
            ) as unknown as DataModel;

            if (item) {
                item.data = { ...item.data, ...data };
                await (item as unknown as PersistableInstance<DataModel>).save();

                res
                    .status(200)
                    .json(item);
            } else {
                res
                    .status(404)
            }
        }
    ]
}