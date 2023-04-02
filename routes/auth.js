const express = require("express");
const router = express.Router();
const auth = require("../controller/auth")
router.post('/login',auth.employeeLogin );
router.post('/manager-login',auth.managerLogin );
module.exports = router