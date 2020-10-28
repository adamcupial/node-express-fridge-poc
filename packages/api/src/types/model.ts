export interface ModelConstructor<DataModel> {
    new(data: DataModel): ModelInstance<DataModel>;
}

export interface ModelInstance<DataModel> {
    data: DataModel;
    toJSON(): DataModel;
}

export interface Indexable<DataModel> extends ModelConstructor<DataModel> {
    getById(id: number): Promise<ModelInstance<DataModel> | null>;
}

export interface Iterable<DataModel> extends ModelConstructor<DataModel> {
    getAll(limit: number, page: number): Promise<ModelInstance<DataModel>[]>;
    getTotal(): Promise<number>;
}

interface PersistableInstance<DataModel> extends ModelInstance<DataModel> {
    save(): Promise<ModelInstance<DataModel>>;
}

export interface Persistable<DataModel> extends ModelConstructor<DataModel> {
    new(data:DataModel): PersistableInstance<DataModel>;
}
