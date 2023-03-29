const express = require("express");
const router = express.Router();
const request = require("../controller/budgetRequest")
router.post('/add-request', request.addRequest);
module.exports = router