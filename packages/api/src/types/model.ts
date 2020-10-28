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

export interface Saveable<DataModel> {
    save(): Promise<ModelInstance<DataModel>>;
}

export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}