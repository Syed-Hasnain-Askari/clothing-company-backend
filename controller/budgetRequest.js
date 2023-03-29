const budgetRequest = require("../models/budgetRequest")
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addRequest = async (req, res) => {
    // Access values in req.body
    const { employeeId, requestAmount } = req.body;
    try {
        const newRequest = new budgetRequest({
            employeeId: new ObjectId(employeeId),
            requestAmount: requestAmount,
            approvedAmount: 0,
            status: 0
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
const approvedRequest = async (req, res) => {
    // Access values in req.body
    const { employeeId, approvedAmount } = req.body;
    console.log(req.body)
    try {
        const updatedRequest = await budgetRequest.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { approvedAmount: approvedAmount, status: 1 } },
            { new: true }
        );
        res.status(200).json({
            response:updatedRequest,
            message:"Request has been approved"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating request' });
    }
}
module.exports = {
    addRequest,
    approvedRequest
}