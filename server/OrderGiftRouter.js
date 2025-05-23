const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const OrderGiftController = require('./OrderGiftController');

router.post('/gift',authMiddleware, OrderGiftController.orderGiftController);

module.exports = router;
