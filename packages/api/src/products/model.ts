import { BaseModel } from '../base/model';
import { DB } from '../utils/db';
import type { Fetchable, Listable, Saveable  } from '../types/model';
import { staticImplements } from '../types/model';

export interface ProductDataModel {
    id?: number;
    name: string;
    description?: string;
}

@staticImplements<Fetchable<ProductDataModel>>()
@staticImplements<Listable<ProductDataModel>>()
export class Product extends BaseModel<ProductDataModel> implements Saveable<ProductDataModel> {
    async save(): Promise<Product> {
        const dataNoId = Object.fromEntries(Object.entries(this.data).filter(([x, ]) => x !== 'id'));

        if (this.data.id) {
            const item = await Product.getById(this.data.id);
            if (item !== null) {
                await DB('products')
                    .update(dataNoId)
                    .where('id', this.data.id);
            }
        }

        if (!this.data.id) {
            const id = await DB('products')
                .insert(dataNoId, 'id');
            this.data = { ...this.data, id: parseInt(`${id}`, 10) };
        }

        return this;
    }

    static async getById(id: number): Promise<Product | null> {
        const item = await DB('products')
            .where('id', id)
            .first();

        if (item) {
            return new Product(item);
        }
        return null;
    }

    static async getTotal(): Promise<number> {
        const result  = await DB('products').count();
        return parseInt(result[0]['count'] as string, 10);
    }

    static async getAll(limit: number, page: number): Promise<Product[]> {
        const items = await DB('products')
            .select()
            .limit(limit)
            .offset((page - 1) * limit);

        return items.map(x => new Product(x));
    }
}