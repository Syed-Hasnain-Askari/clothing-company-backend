const Orders = require("../models/oders")
const Company = require("../models/company")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addOrders = async (req, res) => {
  try {
    const ordersArray = req.body;
    const orders = [];
    ordersArray.forEach(({ employeeId, companyId, products, companyName, bill, quantity }) => {
      const destructuredProducts = products.map(({ productName, productSize, productImage, productPrice }) => ({ productName, productSize, productImage, productPrice }));

      const orderObj = new Orders({
        employeeId,
        companyId,
        products: destructuredProducts,
        companyName,
        bill,
        quantity
      });

      orders.push(orderObj);
    });

    const newOrders = await Orders.insertMany(orders);

    res.status(200).send({
      result: newOrders,
      message: "Orders have been created successfully!"
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Something went wrong!",
      error
    });
  }
}

const getOrders = async (req, res) => {
  try {
    const getOrders = await Orders.aggregate(
      [
        {
          '$lookup': {
            'from': 'employees',
            'localField': 'employeeId',
            'foreignField': '_id',
            'as': 'result'
          }
        }, {
          '$project': {
            'result.employeePassword': 0,
            'result.companyName': 0,
            'result.productsId': 0,
          }
        }
      ]
    )
    res.status(200).send(getOrders);
  }
  catch (error) {
    console.log(error)
    res.send('Something went wrong').status(500);
  }
}
const getOrderByEmployeeId = async (req, res) => {
  console.log(req.query.employeeId)
  const employeeId = req.query.employeeId
  try {
    const getOrderByEmployeeId = await Orders.find({ employeeId: employeeId });
    if (!getOrderByEmployeeId) {
      res.status(400).send({ message: 'ID not found' });
    } else {
      res.send(getOrderByEmployeeId);
    }
  }
  catch (error) {
    console.log(error)
    res.send('Something went wrong').status(500);
  }
}

const getOrderByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  console.log(companyId)
  try {
    const getEmployeeByCompanyId = await Company.aggregate(
      [
        {
          '$match': {
            '_id': new ObjectId(companyId)
          }
        }, {
          '$lookup': {
            'from': 'oders',
            'localField': '_id',
            'foreignField': 'companyId',
            'as': 'orders'
          }
        }, {
          '$lookup': {
            'from': 'employees',
            'localField': '_id',
            'foreignField': 'companyId',
            'as': 'employees'
          }
        }, {
          '$project': {
            'employees.employeePassword': 0,
            'employees.companyName': 0,
            'employees.productsId': 0,
            'employees.companyId': 0
          }
        }
      ]
    )
    res.status(200).send(getEmployeeByCompanyId);
  }
  catch (error) {
    console.log(error)
    res.send('Something went wrong').status(500);
  }
}
module.exports = {
  getOrderByCompanyId,
  getOrders,
  addOrders,
  getOrderByEmployeeId
}