import { Router } from 'express';
import joi from 'joi';
import type { Indexable, ModelConstructor, Iterable, SchemedPersistable} from '../types/model';
import { IndexableSchema, SchemedPersistableSchema, IterableSchema, SchemedPersistableIndexable, PersistableIndexable } from '../types/model';
import { DetailViewFactory, AddViewFactory, PaginatedViewFactory, UpdateViewFactory, PatchViewFactory, DeleteViewFactory } from './views';

export function ModelRouterFactory<DataModel>(model: ModelConstructor<DataModel>): Router {
    const router = Router();

    try {
        joi.assert(new model({} as DataModel), IndexableSchema);
        router.get('/:id', DetailViewFactory<DataModel>(model as Indexable<DataModel>));
    } catch {}

    try {
        joi.assert(new model({} as DataModel), SchemedPersistableSchema);
        router.put('/:id', UpdateViewFactory<DataModel>(model as SchemedPersistableIndexable<DataModel>));
        router.patch('/:id', PatchViewFactory<DataModel>(model as SchemedPersistableIndexable<DataModel>));
        router.delete('/:id', DeleteViewFactory<DataModel>(model as PersistableIndexable<DataModel>));
        router.post('/', AddViewFactory<DataModel>(model as SchemedPersistable<DataModel>));
    } catch {}

    try {
        joi.assert(new model({} as DataModel), IterableSchema);
        router.get('/', PaginatedViewFactory<DataModel>(model as Iterable<DataModel>));
    } catch {};

    if (router.length === 0) {
        throw new Error(`NoRoutesRouter`);
    }

    return router;
}