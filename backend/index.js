require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const RouteUser = require('./routes/user')
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect("mongodb://localhost:27017/authentication",
{useNewUrlParser: true, useUnifiedTopology: true}, 
(err)=>{
    if(!err) console.log('DB Connected');
    else console.log('DB Not Connected');
})

app.use(cors())
app.use(bodyParser.json());
app.use('/', RouteUser);

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server is Running at ${process.env.PORT}`);
})