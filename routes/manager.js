const express = require('express');
const router = express.Router();
const manager = require('../controller/getManagerDetails');
router.get('/get-manager', manager.getManagers);
router.get('/get-allmanager', manager.getAllManagers);
router.get('/get-totalmanager', manager.totalManager);
module.exports = router;
