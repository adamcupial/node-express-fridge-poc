import joi from 'joi';

export interface ModelConstructor<DataModel> {
    new(data: DataModel): ModelInstance<DataModel>;
}

export interface ModelInstance<DataModel> {
    data: DataModel;
    toJSON(): DataModel;
}

export interface DataModel {
    id?: number;
}

export const IndexableSchema = joi
    .object()
    .options({ stripUnknown: true }).keys({
        getById: joi.function().arity(1),
    });

export interface Indexable<DataModel> extends ModelConstructor<DataModel> {
    getById(id: number): Promise<ModelInstance<DataModel> | null>;
}

export const IterableSchema = joi.object()
    .options({ stripUnknown: true })
    .keys({
        getAll: joi.function().maxArity(2),
        getTotal: joi.function().arity(0),
    });

export interface Iterable<DataModel> extends ModelConstructor<DataModel> {
    getAll(limit: number, page: number): Promise<ModelInstance<DataModel>[]>;
    getTotal(): Promise<number>;
}

export interface PersistableInstance<DataModel> extends ModelInstance<DataModel> {
    save(): Promise<ModelInstance<DataModel>>;
    delete(): Promise<void>;
}

export interface Persistable<DataModel> extends ModelConstructor<DataModel> {
    new(data:DataModel): PersistableInstance<DataModel>;
}

export interface Schemed<DataModel> extends ModelConstructor<DataModel> {
    getSchema(partial?: boolean): joi.Schema;
}


export const SchemedPersistableSchema = joi.object()
    .options({ stripUnknown: true })
    .keys({
        save: joi.function().arity(0),
        delete: joi.function().arity(0),
        getSchema: joi.function().arity(0),
    });

export interface SchemedPersistable<DataModel> extends Persistable<DataModel>, Schemed<DataModel> {}
export interface SchemedPersistableIndexable<DataModel> extends SchemedPersistable<DataModel>, Indexable<DataModel> {}
export interface PersistableIndexable<DataModel> extends Indexable<DataModel>, Persistable<DataModel> {}