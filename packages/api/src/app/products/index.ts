import { Product, ProductDataModel } from './model';
import { ModelRouterFactory } from '../../core/router'

export const router = ModelRouterFactory<ProductDataModel>(Product);