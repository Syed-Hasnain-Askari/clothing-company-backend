const express = require('express');
const router = express.Router();
const oders = require('../controller/oders');
router.post('/add-order', oders.addOrders);
router.get('/get-order', oders.getOrders);
router.get('/get-TotalOrder:companyId?', oders.totalOrder);
router.get('/get-orderbyemployeeId', oders.getOrderByEmployeeId);
router.get('/get-orderbycompanyId', oders.getOrderByCompanyId);
module.exports = router;
