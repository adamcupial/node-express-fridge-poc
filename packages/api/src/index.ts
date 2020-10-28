import express from 'express';

import { router as productsRouter } from './products';
import bodyparser from 'body-parser';


const app = express();
const { PORT } = process.env;

app.use(bodyparser.json());
app.use('/products', productsRouter);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});