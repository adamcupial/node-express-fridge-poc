import express from 'express';

import { router as productsRouter } from './products';
import bodyparser from 'body-parser';


export const app = express();

app.use(bodyparser.json());
app.use('/products', productsRouter);
