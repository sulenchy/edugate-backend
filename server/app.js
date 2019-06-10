import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express()

app.get('/', (req, res) => res.send('<h1 style="text-align:center; padding-top:70px">Welcome to EduGate!</h1>'))

app.listen(port, () => winston.log("info",`Example app listening on port ${port}!`))
