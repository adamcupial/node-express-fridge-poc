export interface ModelConstructor<DataModel> {
    new(data: DataModel): ModelInstance<DataModel>;
}

export interface ModelInstance<DataModel> {
    data: DataModel;
    toJSON(): DataModel;
}

export interface Fetchable<DataModel> extends ModelConstructor<DataModel> {
    getById(id: number): Promise<ModelInstance<DataModel> | null>;
}

export interface Listable<DataModel> extends ModelConstructor<DataModel> {
    getAll(limit: number, page: number): Promise<ModelInstance<DataModel>[]>;
    getTotal(): Promise<number>;
}

interface SaveableInstance<DataModel> extends ModelInstance<DataModel> {
    save(): Promise<ModelInstance<DataModel>>;
}

export interface Saveable<DataModel> extends ModelConstructor<DataModel> {
    new(data:DataModel): SaveableInstance<DataModel>;
}
