const budgetRequest = require("../models/budgetRequest")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addRequest = async (req, res) => {
    // Access values in req.body
    const { employeeId, requestAmount } = req.body;
    console.log(employeeId)
    try {
        const newRequest = new budgetRequest({
            employeeId: new ObjectId(employeeId),
            requestAmount: requestAmount,
            aprovedAmount: 0,
            status:0
        });
        const requestCreated = await newRequest.save();
        res.status(200).send({
            result: requestCreated,
            message: "Request has been created successfully!"
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
    addRequest
}