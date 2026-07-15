const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const Payment = require('../models/Payment');
const Withdrawal = require('../models/Withdrawal');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'creator', 'supporter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role.', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user.', error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [totalSupporters, totalCreators, totalCreditsResult, totalPayments] = await Promise.all([
      User.countDocuments({ role: 'supporter' }),
      User.countDocuments({ role: 'creator' }),
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$credits' } } }
      ]),
      Payment.countDocuments({ status: 'completed' })
    ]);

    const totalCredits = totalCreditsResult.length > 0 ? totalCreditsResult[0].total : 0;

    res.json({
      totalSupporters,
      totalCreators,
      totalCredits,
      totalPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats.', error: error.message });
  }
};
