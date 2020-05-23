import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import bodyParser from 'body-parser';
import validator from 'express-validator';
import path from 'path';
import cors from 'cors';
import cookieSession from 'cookie-session';
import fileUpload from 'express-fileupload';
import router from './routes/index';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express()

app.use(cors);

app.use(validator());
app.use(fileUpload());

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET],
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(router);

app.listen(port, () => winston.log("info",`Example app listening on port ${port}!`))

export default app;
