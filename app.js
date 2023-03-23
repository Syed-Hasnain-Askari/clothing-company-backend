'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('tiny'))

app.use((req, res, next)=>{
 res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
 res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
 res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 next();
});
app.get('/', function (req, res) {
    res.status(200).send("Hellow World from app.js")
});
module.exports= app;