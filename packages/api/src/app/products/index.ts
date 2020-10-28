import { Router } from 'express';
import { Product, ProductDataModel } from './model';
import { AddViewFactory, DetailViewFactory, PaginatedViewFactory } from '../../core/views';
import joi from 'joi';

export const router = Router();
const addNewSchema = joi.object().keys({
    name: joi.string().required(),
    description: joi.string(),
});

router.get('/:id', DetailViewFactory<ProductDataModel>(Product));
router.post('/', AddViewFactory<ProductDataModel>(Product, addNewSchema));
router.get('/', PaginatedViewFactory<ProductDataModel>(Product));