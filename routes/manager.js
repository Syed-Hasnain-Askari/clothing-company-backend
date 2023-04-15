const express = require('express');
const router = express.Router();
const manager = require('../controller/getManagerDetails');
router.get('/get-manager', manager.getManagers);
module.exports = router;
