const employee = require('../models/employee');
const getProducts = async (req,res) =>{
    try{
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
    catch(error){
        console.log("Error")
        res.send('Something went wrong').status(500);
    }
}
module.exports = {
    getProducts
}