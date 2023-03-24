'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var csv = require('csvtojson');
const multer = require('multer');
const csvFilePath = `${__dirname}/uploads/usernamefile.csv`;
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('tiny'))
var user = require('./models/modal');

app.use((req, res, next)=>{
 res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
 res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
 res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 next();
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
var upload = multer({ dest: 'uploads/' });
app.post('/', upload.single('file'), (req, res, next) => {
  csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
      var army = [];
      for (var i = 0; i < jsonObj.length; i++) {
        var obj = {};
        obj.employeeName = jsonObj[i]['employeeName'];
        obj.gender = jsonObj[i]['gender'];
        const productsArray = jsonObj[i]['products'].split(',').map(productString => {
          const [productName, productSize] = productString.trim().split(' ');
          console.log(productSize)
          return {
            productName,
            productSize
          };
        });
        army.push({
          employeeName: obj.employeeName,
          gender: obj.gender,
          products: productsArray
        });
      }      
      user.insertMany(army).then(function(){
          res.status(200).send({
              message: "Successfully Uploaded!"
          });
      }).catch(function(error){
          res.status(500).send({
              message: "failure",
              error
          });
      });
  }).catch((error) => {
      res.status(500).send({
          message: "failure",
          error
      });
  })
});
module.exports= app;