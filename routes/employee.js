const express = require('express');
const router = express.Router();
const employee = require('../controller/employee');
router.get('/get-employeebycompanyId', employee.getEmployeeByCompany);
router.get('/get-totalemployee:companyId?', employee.totalEmployee);
module.exports = router;
