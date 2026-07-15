const express = require('express');
const router = express.Router();
const {
  createContribution, approveContribution, rejectContribution,
  getMyContributions, getPendingContributions, getApprovedContributions,
  getSupporterStats
} = require('../controllers/contributionController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.post('/', verifyToken, checkRole('supporter'), createContribution);
router.patch('/:id/approve', verifyToken, checkRole('creator'), approveContribution);
router.patch('/:id/reject', verifyToken, checkRole('creator'), rejectContribution);

router.get('/my-contributions', verifyToken, checkRole('supporter'), getMyContributions);
router.get('/pending', verifyToken, checkRole('creator'), getPendingContributions);
router.get('/approved', verifyToken, checkRole('supporter'), getApprovedContributions);
router.get('/supporter-stats', verifyToken, checkRole('supporter'), getSupporterStats);

module.exports = router;
