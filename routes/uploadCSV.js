const express = require("express");
const upload = require('../controller/uploadCSV');
const router = express.Router();
router.post("/uploadcsv",upload.uploadCSV);
module.exports = router