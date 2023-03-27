const express = require("express");
const router = express.Router();
const products = require("../controller/getProducts")
router.get('/get-products', products.getProducts);
module.exports = router