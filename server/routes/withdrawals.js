const express = require('express');
const router = express.Router();
const {
  createWithdrawal, getMyWithdrawals, getPendingWithdrawals,
  approveWithdrawal, getCreatorEarnings
} = require('../controllers/withdrawalController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.post('/', verifyToken, checkRole('creator'), createWithdrawal);
router.get('/my-withdrawals', verifyToken, checkRole('creator'), getMyWithdrawals);
router.get('/earnings', verifyToken, checkRole('creator'), getCreatorEarnings);
router.get('/pending', verifyToken, checkRole('admin'), getPendingWithdrawals);
router.patch('/:id/approve', verifyToken, checkRole('admin'), approveWithdrawal);

module.exports = router;
