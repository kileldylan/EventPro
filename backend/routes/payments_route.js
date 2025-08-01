const express = require('express');
const paymentsController = require('../controllers/paymentsController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

// Protected admin routes
router.get('/pending', verifyToken, verifyAdmin, paymentsController.getPendingPayments);
router.put('/verify/:paymentId', verifyToken, verifyAdmin, paymentsController.verifyPayment);

module.exports = router;