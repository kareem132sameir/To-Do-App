const express = require('express')
const send = require('send')
const app = express()
const port = process.env.PORT
const mongoose=require('mongoose');
require('./db');
const { json } = require('body-parser');
const todoRoutes=require('./routes/todoRoutes.js');
const userRoutes=require('./routes/userRoutes.js');
require('dotenv').config()


app.use(express.json());

app.use(express.urlencoded());

app.use('/todos',todoRoutes);
app.use('/users',userRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })