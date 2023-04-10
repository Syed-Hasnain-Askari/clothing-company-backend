var csv = require("csvtojson");
const csvFilePath = `${__dirname}/../uploads/usernamefile.csv`;
const employeeProducts = require("../models/employeeProducts");
const companyProductsCollection = require("../models/companyProducts");
const employee = require("../models/employee");
const multer = require("multer");
const company = require("../models/company");
const manager = require("../models/manager");
const { writeFile } = require("../global-functions/GlobalFunctions");
const { parse } = require("uuid");


//for Auto-generated password
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
const productFormatConvertor= (jsonObj)=>{
  // console.log("sss", jsonObj[0].companyProducts)
   const productsArray = jsonObj[0].companyProducts
  .split(",")
  .map((productString) => {
    const [productName, productSize, productImage, Price] = productString
      .trim()
      .split(" ");
    const productPrice = parseInt(Price);
    return {
      productName,
      productSize,
      productImage,
      productPrice,
    };
  });
  return productsArray
}

const uploadCSV = (req, res) => {
  csv()
    .fromFile(csvFilePath)
    .then(async (jsonObj) => {
      // Create an array to hold products data
      const products = [];
      // Create an array to hold employee data
      const emp = [];
      //  subhan-akram , company create here
      const saveCompanyF = async () => {
        const newCompany = new company({
          companyName: jsonObj[0].companyName,
          companyEmail: jsonObj[0].companyEmail,
          companyPhone: jsonObj[0].companyPhone,
          companyFax: jsonObj[0].companyFax,
          companyLogo: jsonObj[0].companyLogo,
        });

        let savedCompany = await newCompany.save();
        return savedCompany;
      };
      const savedCompany = await saveCompanyF();
      
     //for create a collection of company products
      const companyProducts = async (jsonObj) => {
        // console.log("json>>>>",jsonObj)
       let productsArray= await productFormatConvertor(jsonObj);
       console.log(productsArray)
        const companyProductsCollectionArray = new  companyProductsCollection({
          companyId: savedCompany._id,
          products: productsArray,
        });
        await companyProductsCollectionArray.save();
      };
      companyProducts(jsonObj);
      const companyManager = async (i) => {
        if (
          jsonObj[i].managerName != undefined &&
          jsonObj[i].managerEmail != undefined
        ) {
          const newManager = new manager({
            name: jsonObj[i]?.managerName,
            managerEmail: jsonObj[i]?.managerEmail,
            managerPassword: jsonObj[i]?.managerName + "123",
            company: savedCompany._id,
          });

          let savedManager = await newManager.save();
          return savedManager;
        }
      };
      for (let i = 0; i < jsonObj.length; i++) {
        companyManager(i);
      }
      for (var i = 0; i < jsonObj.length; i++) {
        const productsArray = jsonObj[i]['products'].split(',').map(productString => {
          const [productName, productSize, productImage, Price,Quantity] = productString.trim().split(' ');
          const productPrice  = parseInt(Price)
          const productQuantity  = parseInt(Quantity)
          return{
            productName,
            productSize,
            productImage,
            productPrice,
            productQuantity
          };
        });
        products.push({
          products: productsArray,
          companyId:savedCompany._id
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
            obj.budget = jsonObj[i]["budget"];
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
              budget: parseInt(obj.budget),
            });

            //  console.log(empForProduct,"employees")
            //this section will be resolved
            // Subhan-Work , I have removed above forloop ,that was the issue in creating

            emp.push(...empForProduct);
            // console.log("emp>>", emp);
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