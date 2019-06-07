import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';


dotenv.config();


const app = express()

app.get('/', (req, res) => res.send('<h1 style="text-align:center; padding-top:70px">Welcome to EduGate!</h1>'))

app.listen(process.env.PORT, () => winston.log("info",`Example app listening on port ${process.env.PORT}!`))