import joi from 'joi';
import { ValidationMiddlewareFactory } from '../utils/validation';
import type { Persistable, SchemedPersistable } from '../../types/model';
import { Request, Response } from 'express';

export function AddViewFactory<DataModel>(model:SchemedPersistable<DataModel>): any;
export function AddViewFactory<DataModel>(model: Persistable<DataModel>, schema:joi.Schema): any;
export function AddViewFactory<DataModel>(model: Persistable<DataModel> | SchemedPersistable<DataModel>, schema?:joi.Schema): any {
    let validationMw;
    if (schema) {
        validationMw = ValidationMiddlewareFactory(schema, 'body');
    } else if ('getSchema' in model) {
        validationMw = ValidationMiddlewareFactory(model.getSchema(), 'body');
    }

    return [
        validationMw,
        async(req: Request, res: Response) => {
            const item = await new model(req.body).save();
            res
                .status(201)
                .json(item);
        }
    ]
}