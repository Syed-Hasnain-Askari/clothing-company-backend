const employee = require('../models/employee');
const companyProducts = require("../models/companyProducts")
const getProducts = async (req, res) => {
  try {
    const products = await employee.aggregate([
      {
        '$lookup': {
          'from': 'employeeproducts',
          'localField': 'productsId',
          'foreignField': '_id',
          'as': 'result'
        }
      }, {
        '$project': {
          'employeePassword': 0,
          'productsId': 0
        }
      }
    ]);
    res.status(200).send(products);
  }
  catch (error) {
    res.send('Something went wrong').status(500);
  }
}
const getProductsByCompanyId = async (req, res) => {
  const companyId = req.query.companyId
  try {
    const getProductsByCompanyId = await companyProducts.findOne({ companyId: companyId });
    console.log(getProductsByCompanyId)
    if (!getProductsByCompanyId) {
      res.status(400).send({message:"Product not found"});
    } else {
      res.send(getProductsByCompanyId);
    }
  }
  catch (error) {
    console.log(error)
    res.send('Something went wrong').status(500);
  }
}
module.exports = {
  getProducts,
  getProductsByCompanyId
}