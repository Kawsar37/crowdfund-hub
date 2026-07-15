const express = require('express');
const router = express.Router();
const {
  createCampaign, getCampaigns, getApprovedCampaigns, getTopCampaigns,
  getCampaignById, updateCampaign, deleteCampaign, approveCampaign,
  rejectCampaign, getMyCampaigns, getCreatorStats
} = require('../controllers/campaignController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.get('/', getCampaigns);
router.get('/approved', getApprovedCampaigns);
router.get('/top', getTopCampaigns);
router.get('/my-campaigns', verifyToken, checkRole('creator'), getMyCampaigns);
router.get('/creator-stats', verifyToken, checkRole('creator'), getCreatorStats);
router.get('/:id', getCampaignById);

router.post('/', verifyToken, checkRole('creator'), createCampaign);
router.put('/:id', verifyToken, checkRole('creator'), updateCampaign);
router.delete('/:id', verifyToken, checkRole('creator', 'admin'), deleteCampaign);

router.patch('/:id/approve', verifyToken, checkRole('admin'), approveCampaign);
router.patch('/:id/reject', verifyToken, checkRole('admin'), rejectCampaign);

module.exports = router;
