const express = require('express');
const { createOrder, getOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/orders', authMiddleware, createOrder);
router.get('/orders/:id', getOrder);

module.exports = router;
