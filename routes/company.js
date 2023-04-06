const express = require("express");
const router = express.Router();
const companyDetails = require("../controller/getCompanyDetails")
router.get('/getCompanyDetails',companyDetails.getCompanyDetails );
module.exports = router