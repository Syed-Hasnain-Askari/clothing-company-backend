'use strict';
var mongoose = require('mongoose');
var app = require('./app');
var config = require('./configuration/config');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
var port = 3977;
mongoose.connect('mongodb://0.0.0.0:27017/clothingcompany')
  .then(() => {
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
        port,
        console.log(`Server is running on the port no: ${port} `),
      );
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
