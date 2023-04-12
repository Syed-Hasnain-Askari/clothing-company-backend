const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const employee = require('../models/employee');
const companyProducts = require('../models/companyProducts');
const company = require('../models/company');

const getProductsByEmployeeId = async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const employeeProducts = await employee.aggregate([
      {
        $match: {
          _id: new ObjectId(employeeId)
        }
      }, {
        $lookup: {
          from: 'employeeproducts',
          localField: 'productsId',
          foreignField: '_id',
          as: 'products'
        }
      }, {
        $project: {
          employeePassword: 0,
          companyName: 0,
          companyId: 0,
          productsId: 0
        }
      }
    ]);
    res.status(200).send(employeeProducts);
  } catch (error) {
    res.send('Something went wrong').status(500);
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await employee.aggregate([
      {
        $lookup: {
          from: 'employeeproducts',
          localField: 'productsId',
          foreignField: '_id',
          as: 'result'
        }
      }, {
        $project: {
          employeePassword: 0,
          productsId: 0
        }
      }
    ]);
    res.status(200).send(products);
  } catch (error) {
    res.send('Something went wrong').status(500);
  }
};
const getEmployeeProductByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  console.log();
  try {
    const products = await company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId)
        }
      }, {
        $lookup: {
          from: 'employeeproducts',
          localField: '_id',
          foreignField: 'companyId',
          as: 'products'
        }
      }, {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'companyId',
          as: 'employees'
        }
      },
      {
        $project: {
          'employees.employeePassword': 0,
          'employees.productsId': 0,
          'employees.companyId': 0
        }
      }
    ]);
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getProductsByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getProductsByCompanyId = await companyProducts.findOne({ companyId });
    console.log(getProductsByCompanyId);
    if (!getProductsByCompanyId) {
      res.status(400).send({ message: 'Product not found' });
    } else {
      res.send(getProductsByCompanyId);
    }
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
module.exports = {
  getProducts,
  getEmployeeProductByCompanyId,
  getProductsByCompanyId,
  getProductsByEmployeeId
};
