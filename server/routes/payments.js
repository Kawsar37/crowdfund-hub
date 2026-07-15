const express = require('express');
const router = express.Router();
const {
  createCheckoutSession, handleWebhook, getMyPayments,
  getAllPayments, dummyPayment, getCredits, verifySession
} = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.get('/credits', getCredits);
router.post('/create-checkout-session', verifyToken, checkRole('supporter'), createCheckoutSession);
router.post('/dummy-payment', verifyToken, checkRole('supporter'), dummyPayment);
router.get('/my-payments', verifyToken, checkRole('supporter'), getMyPayments);
router.get('/all', verifyToken, checkRole('admin'), getAllPayments);
router.get('/verify-session', verifyToken, verifySession);

// Stripe webhook - needs raw body, handled in index.js
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
