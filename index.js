const express = require('express')
const send = require('send')
const app = express()
const mongoose=require('mongoose');
require('./db');
const { json } = require('body-parser');
const todoRoutes=require('./routes/todoRoutes.js');
const userRoutes=require('./routes/userRoutes.js');
const { verfiy_token } = require('./controllers/verify_token');
require('dotenv').config()
const port=process.env.PORT

app.use(express.json());

app.use(express.urlencoded());

app.use('/todos',verfiy_token,todoRoutes);
app.use('/users',userRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })