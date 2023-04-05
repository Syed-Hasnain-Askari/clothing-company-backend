const company = require("../models/company")
const getCompanyDetails = async (req, res) => {
    const companyId = req.query.companyId
    try {
      const getDetails = await company.findOne({ _id: companyId });
      console.log(getDetails)
      if (!getDetails) {
        res.status(400).send({message:"Company not found"});
      } else {
        res.send(getDetails);
      }
    }
    catch (error) {
      console.log(error)
      res.send('Something went wrong').status(500);
    }
  }
  module.exports = {
    getCompanyDetails
  }