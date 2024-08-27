const express = require('express');
const paymentController = require('../controllers/paymentControllers');
const authMiddleware = require('../middleware/paymentAuth');
const router = express.Router();

router.post('/connect', authMiddleware, async (req, res) => {
    try {
        await paymentController.start(); 
        res.status(200).json({ message: 'Connected to RabbitMQ' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
