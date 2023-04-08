'use strict';
var mongoose = require('mongoose');
var app = require('./app');
var config = require('./configuration/config');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
var port = 3977;
// mongodb://0.0.0.0:27017/clothingcompany
const DB = config.mongo.uri
mongoose.connect(DB,{
    useNewUrlParser: true, useUnifiedTopology: true 
}).then(()=>{
    console.log("connection successfully !")
    app.use(bodyParser.json());
    //Enable CORS policy
    app.use(cors());
    app.options('*', cors());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    http
      .createServer(app)
      .listen(
        process.env.PORT || {port},
        console.log(`Server is running on the port no: ${port} `),
      );
}).catch((err)=>{console.log("err",err)})