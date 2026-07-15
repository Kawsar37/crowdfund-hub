const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getAdminStats } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.get('/', verifyToken, checkRole('admin'), getAllUsers);
router.get('/admin-stats', verifyToken, checkRole('admin'), getAdminStats);
router.patch('/:id/role', verifyToken, checkRole('admin'), updateUserRole);
router.delete('/:id', verifyToken, checkRole('admin'), deleteUser);

module.exports = router;
