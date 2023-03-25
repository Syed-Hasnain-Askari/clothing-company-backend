var csv = require('csvtojson');
const multer = require('multer');
const csvFilePath = `${__dirname}/uploads/usernamefile.csv`;
const employeeProducts = require('../models/employeeProducts');
const employee = require('../models/employee');
const upload = multer({ dest: 'uploads/' });
const uploadCSV = upload.single('file', (req, res, next) => {
      csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        // Create an array to hold user data
        const products = [];
        // Create an array to hold employee data
        const emp = [];
  
        for (var i = 0; i < jsonObj.length; i++) {
          var obj = {};
          obj.employeeName = jsonObj[i]['employeeName'];
          obj.employeeEmail = jsonObj[i]['employeeEmail'];
          obj.companyName = jsonObj[i]['companyName'];
          obj.gender = jsonObj[i]['gender'];
          const productsArray = jsonObj[i]['products'].split(',').map(productString => {
            const [productName, productSize] = productString.trim().split(' ');
            console.log(productSize)
            return {
              productName,
              productSize
            };
          });
          products.push({
            companyName: obj.companyName,
            gender: obj.gender,
            products: productsArray,
            employeeName: obj.employeeName,
            employeeEmail: obj.employeeEmail,
          });
          emp.push({
            employeeName: obj.employeeName,
            employeeEmail: obj.employeeEmail,
            gender: obj.gender,
          })
        }
        // Insert data into employeeProducts collection
        employeeProducts.insertMany(products)
          .then(function (insertedProducts) {
            // Create an array to hold employee data
            const emp = [];
  
            insertedProducts.forEach(function (product) {
              // Create an array to hold employee data for each product
              const empForProduct = [];
  
              for (var i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i]['companyName'] === product.companyName) {
                  var obj = {};
                  obj.employeeName = jsonObj[i]['employeeName'];
                  obj.employeeEmail = jsonObj[i]['employeeEmail'];
                  obj.gender = jsonObj[i]['gender'];
  
                  empForProduct.push({
                    productsId: product._id,
                    employeeName: obj.employeeName,
                    employeeEmail: obj.employeeEmail,
                    gender: obj.gender
                  });
                }
              }
              emp.push(...empForProduct);
            });
            employee.insertMany(emp)
              .then(function () {
                res.status(200).send({
                  message: "Successfully Uploaded!"
                });
              })
              .catch(function (error) {
                res.status(500).send({
                  message: "Error uploading user data to employee collection:",
                  error
                });
              });
          })
          .catch(function (error) {
            res.status(500).send({
              message: "Error uploading product data to employeeProducts collection:",
              error
            });
          });
      })
      .catch((error) => {
        res.status(500).send({
          message: "failure",
          error
        });
      })
  });
module.exports = {
    uploadCSV
}