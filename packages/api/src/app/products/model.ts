import { BaseModel } from '../../core/base/model';
import { DB } from '../../core/utils/db';
import type { Indexable, Iterable, Persistable, Schemed } from '../../types/model';
import { staticImplements } from '../../core/utils/ts-helpers';
import joi from 'joi';

export interface ProductDataModel {
    id?: number;
    name: string;
    description?: string;
}

@staticImplements<Schemed<ProductDataModel>>()
@staticImplements<Indexable<ProductDataModel>>()
@staticImplements<Persistable<ProductDataModel>>()
@staticImplements<Iterable<ProductDataModel>>()
export class Product extends BaseModel<ProductDataModel> {
    async save(): Promise<Product> {
        const dataNoId = Object.fromEntries(
            Object.entries(this.data)
            .filter(([x, ]) => x !== 'id')
        );

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

    async delete(): Promise<void> {
        if (this.data.id) {
            await DB('products')
                .where('id', this.data.id)
                .delete();
        }
    }

    static getSchema(partial: boolean = false) {
        if (partial) {
            return joi.object().keys({
                name: joi.string(),
                description: joi.string(),
            });
        }
        return joi.object().keys({
            name: joi.string().required(),
            description: joi.string(),
        });
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