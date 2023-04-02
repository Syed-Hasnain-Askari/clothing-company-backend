const express = require("express");
const router = express.Router();
const productsByCompanyId = require("../controller/getProducts")
const products = require("../controller/getProducts")
router.get('/get-products', products.getProducts);
router.get('/get-productsbycompanyId', productsByCompanyId.getProductsByCompanyId);
module.exports = router