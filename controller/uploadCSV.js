var csv = require('csvtojson');
const csvFilePath = `${__dirname}/../uploads/usernamefile.csv`;
const employeeProducts = require('../models/employeeProducts');
const employee = require('../models/employee');
const multer = require('multer');
const company = require('../models/company');
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 5) + 8; // Random length between 8 and 12
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  return password;
}
const uploadCSV = (req, res) => {
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      // Create an array to hold user data
      const products = [];
      // Create an array to hold employee data
      const emp = [];

      let companyAdded = false;

      for (var i = 0; i < jsonObj.length; i++) {
        var obj = {};
        obj.companyName = jsonObj[i]['companyName'];
        obj.budget = jsonObj[i]['budget'];
        const productsArray = jsonObj[i]['products'].split(',').map(productString => {
          const [productName, productSize, productImage, Price] = productString.trim().split(' ');
          const productPrice  = parseInt(Price)
          return{
            productName,
            productSize,
            productImage,
            productPrice
          };
        });
        products.push({
          companyName: obj.companyName,
          products: productsArray,
          budget:parseInt(obj.budget)
        });
      }
      // Insert data into employeeProducts collection
      employeeProducts.insertMany(products)
        .then(function (insertedProducts) {
          insertedProducts.forEach(function (product) {
            // Create an array to hold employee data for each product
            const empForProduct = [];
            for (var i = 0; i < jsonObj.length; i++) {
              var obj = {};
              obj.employeeName = jsonObj[i]['employeeName'];
              obj.employeeEmail = jsonObj[i]['employeeEmail'];
              obj.gender = jsonObj[i]['gender'];
              const generatedPassword = generatePassword();
              empForProduct.push({
                productsId: product._id,
                employeeName: obj.employeeName,
                employeePassword: generatedPassword,
                employeeEmail: obj.employeeEmail,
                gender: obj.gender
              });
            }
            //  console.log(empForProduct,"employees")
            //this section will be resolved
            emp.push(...empForProduct);
          });
          //get employe email to find already existed users
          const employeeEmails = emp.map(emp => emp.employeeEmail);
          //to find email of users
          employee.find({ employeeEmail: { $in: employeeEmails } })
            .then(function (existingEmployees) {
              const existingEmails = existingEmployees.map(emp => emp.employeeEmail);
              const newEmployees = emp.filter(emp => !existingEmails.includes(emp.employeeEmail));
              employee.insertMany(newEmployees).then((emp) => {
                emp.map(function (item) {
                  const newCompany = new company({
                    companyName: obj.companyName,
                    employees: item._id
                  });
                  newCompany.save();
                });
              })
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
                message: "Error checking existing employees in employee collection:",
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
      console.log(error)
      res.status(500).send({
        message: "failure",
        error
      });
    })
};


module.exports = {
  uploadCSV
}