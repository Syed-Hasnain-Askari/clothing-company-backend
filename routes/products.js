const express = require("express");
const router = express.Router();
const products = require("../controller/getProducts")
router.get('/get-products', products.getProducts);
router.get('/get-getemployeeproductbycompanyId',products.getEmployeeProductByCompanyId);
router.get('/get-productsbycompanyId',products.getProductsByCompanyId);
module.exports = router 