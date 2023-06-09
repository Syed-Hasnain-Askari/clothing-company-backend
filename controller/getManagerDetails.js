const Manager = require('../models/manager');
const getManagers = async (req, res) => {
  try {
    const managers = await Manager.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          'result.companyEmail': 0,
          'result.companyPhone': 0,
          'result.companyFax': 0,
          'result.companyLogo': 0,
        },
      },
    ]); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find(); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
const totalManager = async (req, res) => {
  try {
    let pipeline = [
      {
        $count: 'totalManager',
      },
    ];
    const getTotalManager = await Manager.aggregate(pipeline);
    res.status(200).send(getTotalManager);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
module.exports = {
  getManagers,
  getAllManagers,
  totalManager,
};
