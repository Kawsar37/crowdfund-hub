const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');

exports.createWithdrawal = async (req, res) => {
  try {
    const { withdrawal_credit, payment_system, account_number } = req.body;

    if (!withdrawal_credit || !payment_system || !account_number) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (withdrawal_credit < 200) {
      return res.status(400).json({ message: 'Minimum withdrawal is 200 credits ($10).' });
    }

    // Calculate total raised credits
    const raisedResult = await Campaign.aggregate([
      { $match: { creator_email: req.user.user_email } },
      { $group: { _id: null, total: { $sum: '$amount_raised' } } }
    ]);

    const totalRaised = raisedResult.length > 0 ? raisedResult[0].total : 0;

    // Calculate already withdrawn amounts
    const withdrawnResult = await Withdrawal.aggregate([
      { $match: { creator_email: req.user.user_email, status: { $in: ['pending', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$withdrawal_credit' } } }
    ]);

    const totalWithdrawn = withdrawnResult.length > 0 ? withdrawnResult[0].total : 0;
    const availableCredits = totalRaised - totalWithdrawn;

    if (withdrawal_credit > availableCredits) {
      return res.status(400).json({ message: 'Insufficient credits for withdrawal.' });
    }

    // 20 credits = $1 dollar
    const withdrawal_amount = withdrawal_credit / 20;

    const withdrawal = await Withdrawal.create({
      creator_email: req.user.user_email,
      creator_name: req.user.display_name,
      withdrawal_credit: Number(withdrawal_credit),
      withdrawal_amount,
      payment_system,
      account_number,
      status: 'pending'
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create withdrawal request.', error: error.message });
  }
};

exports.getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ creator_email: req.user.user_email })
      .sort({ withdraw_date: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch withdrawals.', error: error.message });
  }
};

exports.getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'pending' })
      .sort({ withdraw_date: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending withdrawals.', error: error.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found.' });
    }

    withdrawal.status = 'approved';
    await withdrawal.save();

    // Decrease creator's raised credits by the withdrawal amount
    // We update the campaigns' amount_raised by subtracting the withdrawn credits
    const campaigns = await Campaign.find({ creator_email: withdrawal.creator_email }).sort({ amount_raised: -1 });
    let remaining = withdrawal.withdrawal_credit;

    for (const campaign of campaigns) {
      if (remaining <= 0) break;
      const deduct = Math.min(campaign.amount_raised, remaining);
      campaign.amount_raised -= deduct;
      remaining -= deduct;
      await campaign.save();
    }

    // Notify creator
    await Notification.create({
      message: `Your withdrawal request of ${withdrawal.withdrawal_credit} credits ($${withdrawal.withdrawal_amount}) has been approved.`,
      toEmail: withdrawal.creator_email,
      actionRoute: '/dashboard/creator/withdrawals',
      time: new Date()
    });

    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve withdrawal.', error: error.message });
  }
};

exports.getCreatorEarnings = async (req, res) => {
  try {
    const raisedResult = await Campaign.aggregate([
      { $match: { creator_email: req.user.user_email } },
      { $group: { _id: null, total: { $sum: '$amount_raised' } } }
    ]);

    const totalRaised = raisedResult.length > 0 ? raisedResult[0].total : 0;

    const withdrawnResult = await Withdrawal.aggregate([
      { $match: { creator_email: req.user.user_email, status: { $in: ['pending', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$withdrawal_credit' } } }
    ]);

    const totalWithdrawn = withdrawnResult.length > 0 ? withdrawnResult[0].total : 0;
    const availableCredits = totalRaised - totalWithdrawn;
    const withdrawalAmount = availableCredits / 20;

    res.json({
      totalRaised,
      totalWithdrawn,
      availableCredits,
      withdrawalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch earnings.', error: error.message });
  }
};
