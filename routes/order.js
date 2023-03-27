const express = require("express");
const router = express.Router();
const oders = require("../controller/oders")
router.post('/add-order', oders.addOders);
module.exports = router