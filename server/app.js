const express = require('express')
require('dotenv').config()
const app = express()

console.log(process.env.PORT)

app.get('/', (req, res) => res.send('<h1 style="text-align:center; padding-top:70px">Welcome to EduGate!</h1>'))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))