const Orders = require("../models/oders")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addOrders = async (req, res) => {
    try {
      const ordersArray = req.body;
      const orders = [];
      ordersArray.forEach(({ employeeId, products, companyName, bill, quantity }) => {
        const destructuredProducts = products.map(({ productName, productSize, productImage, productPrice }) => ({ productName, productSize, productImage, productPrice }));
  
        const orderObj = new Orders({
          employeeId,
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
  



const getOrders = async (req,res) =>{
    try{
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
    catch(error){
        console.log(error)
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