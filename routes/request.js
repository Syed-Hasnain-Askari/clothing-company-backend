const express = require("express");
const router = express.Router();
const request = require("../controller/budgetRequest")
router.get('/get-request', request.getBudgetRequest);
router.post('/add-request', request.addRequest);
router.put('/approved-request', request.approvedRequest);
module.exports = router