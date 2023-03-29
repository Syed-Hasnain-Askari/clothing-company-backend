const budgetRequest = require("../models/budgetRequest")
const budget = require("../models/employeeProducts")
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
    const { employeeId, approvedAmount,productId } = req.body;
    console.log(req.body)
    try {
         // Update the approvedAmount and status values in request collection
        const updatedRequest = await budgetRequest.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { approvedAmount: approvedAmount, status: 1 } },
            { new: true }
        );
           // Update the budget value from employeeProducts collection
           const updatedBudget = await budget.findOneAndUpdate(
            { _id: productId},
            { $inc: { budget: approvedAmount } },
            { new: true }
        );
        res.status(200).json({
            updatedRequest: updatedRequest,
            updatedBudget: updatedBudget,
            message: 'Request has been approved'
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