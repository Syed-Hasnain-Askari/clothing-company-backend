const oders = require("../models/oders")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addOders = async (req, res) => {
    // Access values in req.body
    const { employeeId, products, companyName,bill } = req.body;
    console.log(employeeId)
    try {
        const order = new oders({
            employeeId: new ObjectId(employeeId),
            products: products,
            companyName: companyName,
            bill:bill
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
module.exports = {
    addOders
}