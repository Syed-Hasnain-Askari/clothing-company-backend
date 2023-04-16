const company = require('../models/company');
const mongoose = require('mongoose');
const Employee = require('../models/employee');
const ObjectId = mongoose.Types.ObjectId;
const getEmployeeByCompany = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getEmployeeByCompanyId = await company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'companyId',
          as: 'result',
        },
      },
      {
        $project: {
          'result.employeePassword': 0,
          'result.companyName': 0,
          'result.productsId': 0,
          'result.companyId': 0,
        },
      },
    ]);
    res.status(200).send(getEmployeeByCompanyId);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const totalEmployee = async (req, res) => {
  try {
    const { companyId } = req.query;
    let pipeline = [
      {
        $count: 'totalEmployee',
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
    const getTotalEmployee = await Employee.aggregate(pipeline);
    res.status(200).send(getTotalEmployee);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getEmployee = async (req, res) => {
  try {
    const managers = await Employee.find(); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
module.exports = {
  getEmployeeByCompany,
  totalEmployee,
  getEmployee,
};
