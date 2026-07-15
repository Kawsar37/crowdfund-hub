const express = require('express');
const router = express.Router();
const { createReport, getAllReports, resolveReport, dismissReport, deleteReportedCampaign } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.post('/', verifyToken, checkRole('supporter'), createReport);
router.get('/', verifyToken, checkRole('admin'), getAllReports);
router.patch('/:id/resolve', verifyToken, checkRole('admin'), resolveReport);
router.patch('/:id/dismiss', verifyToken, checkRole('admin'), dismissReport);
router.delete('/:id/campaign', verifyToken, checkRole('admin'), deleteReportedCampaign);

module.exports = router;
