const company = require("../models/company")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const getEmployeeByCompany = async (req,res) =>{
    const companyId = req.query.companyId;
    console.log(companyId)
    try{
        const getEmployeeByCompanyId = await company.aggregate(
            [
                {
                    '$match': {
                      '_id': new ObjectId(companyId)
                    }
                  }, {
                    '$lookup': {
                      'from': 'employees', 
                      'localField': '_id', 
                      'foreignField': 'companyId', 
                      'as': 'result'
                    }
                  }, {
                    '$project': {
                      'result.employeePassword': 0, 
                      'result.companyName': 0, 
                      'result.productsId': 0, 
                      'result.companyId': 0
                    }
                  }
              ]
        )
        res.status(200).send(getEmployeeByCompanyId);
    }
    catch(error){
        console.log(error)
        res.send('Something went wrong').status(500);
    }
}
module.exports = {
    getEmployeeByCompany
}