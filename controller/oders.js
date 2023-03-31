const Orders = require("../models/oders")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addOrders = async (req, res) => {
    // Access values in req.body
    const { employeeId, products, companyName,bill,quantity } = req.body;
    try {
        const order = new Orders({
            employeeId: employeeId,
            products: products,
            companyName: companyName,
            bill:bill,
            quantity:quantity
        });
        const newOders = await order.save();
        res.status(200).send({
            result: newOders,
            message: "Oder has been created successfully!"
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Something went wrong!",
            error
        });
    }
}
const getOrders = async (req,res) =>{
    try{
        const getOrders = await oders.aggregate(
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
    catch(error){
        res.send('Something went wrong').status(500);
    }
}
const getOrderByEmployeeId = async (req,res) =>{
    console.log(req.query.employeeId)
    const employeeId = req.query.employeeId
    try{
        const getOrderByEmployeeId = await Orders.find({employeeId: employeeId});
        if (!getOrderByEmployeeId) {
            res.status(400).send({message: 'ID not found'});
          } else {
            res.send(getOrderByEmployeeId);
          }
    }
    catch(error){
        console.log(error)
        res.send('Something went wrong').status(500);
    }
}
module.exports = {
    getOrders,
    addOrders,
    getOrderByEmployeeId
}