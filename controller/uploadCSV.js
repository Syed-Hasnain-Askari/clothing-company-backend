var csv = require("csvtojson");
const csvFilePath = `${__dirname}/../uploads/usernamefile.csv`;
const employeeProducts = require("../models/employeeProducts");
const employee = require("../models/employee");
const multer = require("multer");
const company = require("../models/company");
const { writeFile } = require("../global-functions/GlobalFunctions");
function generatePassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * 5) + 8; // Random length between 8 and 12
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  return password;
}

const uploadCSV = (req, res) => {
    csv()
    .fromFile(csvFilePath)
    .then(async (jsonObj) => {
      // Create an array to hold user data
      const products = [];
      // Create an array to hold employee data
      const emp = [];
      //  subhan-akram , company create here
      const saveCompanyF = async () => {
        const newCompany = new company({
          companyName: jsonObj[0].companyName,
        });

        let savedCompany = await newCompany.save();
        return savedCompany;
      };
      const savedCompany = await saveCompanyF();

      let companyAdded = false;

      for (var i = 0; i < jsonObj.length; i++) {
        var obj = {};
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
          products: productsArray,
          budget:parseInt(obj.budget)
        });
      }
      // Insert data into employeeProducts collection
      employeeProducts
        .insertMany(products)
        .then(function (insertedProducts) {
          insertedProducts.forEach(function (product, i) {
            const empForProduct = [];
            var obj = {};
            obj.employeeName = jsonObj[i]["employeeName"];
            obj.employeeEmail = jsonObj[i]["employeeEmail"];
            obj.gender = jsonObj[i]["gender"];
            obj.companyName = savedCompany.companyName;
            obj.companyId = savedCompany.id;

            const generatedPassword = generatePassword();
            empForProduct.push({
              productsId: product._id,
              employeeName: obj.employeeName,
              employeePassword: generatedPassword,
              employeeEmail: obj.employeeEmail,
              gender: obj.gender,
              companyName: obj.companyName,
              companyId: obj.companyId,
            });

            //  console.log(empForProduct,"employees")
            //this section will be resolved
            // Subhan-Work , I have removed above forloop ,that was the issue in creating

            emp.push(...empForProduct);
            console.log("emp>>", emp);
          });
          //get employe email to find already existed users

          const employeeEmails = emp.map((emp) => emp.employeeEmail);
          //to find email of users
          employee
            .find({ employeeEmail: { $in: employeeEmails } })
            .then(function (existingEmployees) {
              const existingEmails = existingEmployees.map(
                (emp) => emp.employeeEmail
              );
              const newEmployees = emp.filter(
                (emp) => !existingEmails.includes(emp.employeeEmail)
              );
              employee
                .insertMany(newEmployees)
                .then(function () {
                  res.status(200).send({
                    message: "Successfully Uploaded!",
                  });
                })
                .catch(function (error) {
                  res.status(500).send({
                    message:
                      "Error uploading user data to employee collection:",
                    error,
                  });
                });
            })
            .catch(function (error) {
              res.status(500).send({
                message:
                  "Error checking existing employees in employee collection:",
                error,
              });
            });
        })
        .catch(function (error) {
          res.status(500).send({
            message:
              "Error uploading product data to employeeProducts collection:",
            error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: "failure",
        error,
      });
    });
};

module.exports = {
  uploadCSV,
};
