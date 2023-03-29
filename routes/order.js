const express = require("express");
const router = express.Router();
const oders = require("../controller/oders")
router.post('/add-order', oders.addOrders);
router.get('/get-order', oders.getOrders);
module.exports = router