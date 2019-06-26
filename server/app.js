import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import bodyParser from 'body-parser';
import path from 'path';

import router from './controllers/index';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(router);

app.listen(port, () => winston.log("info",`Example app listening on port ${port}!`))

export default app;
