'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var app = express();

// Routes
const upload = require('./routes/uploadCSV');
const getProducts = require('./routes/products');
const addOrder = require('./routes/order');
const addRequest = require('./routes/request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'))
// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// These all are endpoint
app.use('/api/upload/', upload);
app.use('/api/product/', getProducts);
app.use('/api/order/', addOrder);
app.use('/api/request/', addRequest);
module.exports = app;