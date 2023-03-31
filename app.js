'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var app = express();

// Routes
const auth = require('./routes/auth');
const upload = require('./routes/uploadCSV');
const getProducts = require('./routes/products');
const addOrder = require('./routes/order');
const getOrder = require('./routes/order');
const getRequest = require('./routes/request');
const addRequest = require('./routes/request');
const approvedRequest = require('./routes/request');
const getOrderByEmployeeId = require('./routes/request');

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
app.use('/api/auth/', auth);
app.use('/api/upload/', upload);
app.use('/api/product/', getProducts);
app.use('/api/order/', addOrder);
app.use('/api/order/', getOrder);
app.use('/api/request/', getRequest);
app.use('/api/request/', addRequest);
app.use('/api/request/', approvedRequest);
app.use('/api/order/', getOrderByEmployeeId);

module.exports = app;