import { ModelInstance } from '../../types/model';

export abstract class BaseModel<DataType> implements ModelInstance<DataType> {
    __data: DataType;

    constructor(data: DataType)  {
        this.__data = data;
    }

    get data() {
        return this.__data;
    }

    set data(newData: DataType) {
        this.__data = newData;
    }

    toJSON() {
        return this.data;
    }
}