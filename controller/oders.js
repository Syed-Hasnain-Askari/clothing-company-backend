const Orders = require("../models/oders");
const Employee = require("../models/employee");
const employeeProducts = require("../models/employeeProducts");
const Company = require("../models/company");
const mongoose = require("mongoose");
const { sendEmail } = require("../global-functions/GlobalFunctions");
const employee = require("../models/employee");
const ObjectId = mongoose.Types.ObjectId;
const addOrders = async (req, res) => {
  try {
    const ordersArray = req.body;

    const orders = [];
    let isValidOrder = true;
    for (const orderData of ordersArray) {
      const { employeeId, bill } = orderData;
      const employee = await Employee.findById(employeeId);
      if (!employee || employee.budget < bill) {
        isValidOrder = false;
        break;
      }
      // eslint-disable-next-line max-len
      const destructuredProducts = orderData.products.map(
        ({ productName, productSize, productImage, productPrice }) => ({
          productName,
          productSize,
          productImage,
          productPrice,
        })
      );
      const orderObj = new Orders({
        employeeId,
        companyId: orderData.companyId,
        products: destructuredProducts,
        companyName: orderData.companyName,
        bill: orderData.bill,
        quantity: orderData.quantity,
        comment: orderData.comment,
      });
      orders.push(orderObj);
    }
    if (!isValidOrder) {
      return res.status(400).send({
        message: "Invalid order - employee budget is insufficient",
      });
    }
    const newOrders = await Orders.insertMany(orders);
    // Update the budget value for all employees with matching IDs
    let mailOptionsF = (employeeEmail, managerEmail, companyName) => {
      return {
        from: "subhan.akram2400@gmail.com",
        to: [managerEmail, employeeEmail],
        subject: `Hi , Order Created`,
        text: `New Order is created for employee :${employeeEmail} `,
      };
    };
    for (const order of newOrders) {
      const { employeeId, bill } = order;

      await Employee.findOneAndUpdate(
        { _id: employeeId },
        { $inc: { budget: -bill } }
      );
    }
    for (let i = 0; i < ordersArray.length; i++) {
      let mailOptions = mailOptionsF(
        ordersArray[i].employeeEmail,
        ordersArray[i].managerEmail,
        ordersArray[i].companyName
      );
      sendEmail(mailOptions);
    }
    // Empty products array in employeeProducts collection
    for (const orderData of ordersArray) {
      const { id } = orderData;
      await employeeProducts.findOneAndUpdate(
        { _id: id },
        { $set: { products: [] } }
      );
    }
    res.status(200).send({
      result: newOrders,
      message: "Orders have been created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong!",
      error,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const getOrders = await Orders.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          "result.employeePassword": 0,
          "result.companyName": 0,
          "result.productsId": 0,
        },
      },
    ]);
    res.status(200).send(getOrders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong").status(500);
  }
};
const totalOrder = async (req, res) => {
  try {
    const { companyId } = req.query;

    let pipeline = [
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $count: "totalOrder",
      },
    ];

    if (companyId) {
      pipeline = [
        {
          $match: { companyId: new ObjectId(companyId) },
        },
        ...pipeline,
      ];
    }

    const getTotalOrders = await Orders.aggregate(pipeline);
    res.status(200).send(getTotalOrders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong").status(500);
  }
};

const getOrderByEmployeeId = async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const getOrderByEmployeeId = await Orders.find({ employeeId });
    if (!getOrderByEmployeeId) {
      res.status(400).send({ message: "ID not found" });
    } else {
      res.send(getOrderByEmployeeId);
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong").status(500);
  }
};

const getOrderByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  console.log(companyId);
  try {
    const getEmployeeByCompanyId = await Company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "oders",
          localField: "_id",
          foreignField: "companyId",
          as: "orders",
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "companyId",
          as: "employees",
        },
      },
      {
        $project: {
          "employees.employeePassword": 0,
          "employees.companyName": 0,
          "employees.productsId": 0,
          "employees.companyId": 0,
        },
      },
    ]);
    res.status(200).send(getEmployeeByCompanyId);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong").status(500);
  }
};
module.exports = {
  getOrderByCompanyId,
  getOrders,
  totalOrder,
  addOrders,
  getOrderByEmployeeId,
};
