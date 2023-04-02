const express = require("express");
const router = express.Router();
const employee = require("../controller/employee")
router.get('/get-employeebycompanyId',employee.getEmployeeByCompany );
module.exports = router