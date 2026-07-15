const Contribution = require('../models/Contribution');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createContribution = async (req, res) => {
  try {
    const { campaign_id, Contribution_amount, message } = req.body;

    if (!campaign_id || !Contribution_amount) {
      return res.status(400).json({ message: 'Campaign and amount are required.' });
    }

    const campaign = await Campaign.findById(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign is not approved yet.' });
    }

    if (new Date(campaign.deadline) < new Date()) {
      return res.status(400).json({ message: 'Campaign deadline has passed.' });
    }

    if (Contribution_amount < campaign.minimum_Contribution) {
      return res.status(400).json({ message: `Minimum contribution is ${campaign.minimum_Contribution} credits.` });
    }

    if (req.user.credits < Contribution_amount) {
      return res.status(400).json({ message: 'Insufficient credits. Please purchase more.' });
    }

    // Deduct credits from supporter
    await User.findOneAndUpdate(
      { user_email: req.user.user_email },
      { $inc: { credits: -Contribution_amount } }
    );

    const contribution = await Contribution.create({
      campaign_id,
      campaign_title: campaign.campaign_title,
      Contribution_amount: Number(Contribution_amount),
      Supporter_email: req.user.user_email,
      Supporter_name: req.user.display_name,
      creator_name: campaign.creator_name,
      creator_email: campaign.creator_email,
      message: message || '',
      status: 'pending'
    });

    // Notify creator
    await Notification.create({
      message: `${req.user.display_name} contributed ${Contribution_amount} credits to "${campaign.campaign_title}".`,
      toEmail: campaign.creator_email,
      actionRoute: '/dashboard/creator',
      time: new Date()
    });

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contribution.', error: error.message });
  }
};

exports.approveContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found.' });
    }

    if (contribution.creator_email !== req.user.user_email) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    contribution.status = 'approved';
    await contribution.save();

    // Add to campaign raised amount
    await Campaign.findByIdAndUpdate(
      contribution.campaign_id,
      { $inc: { amount_raised: contribution.Contribution_amount } }
    );

    // Notify supporter
    await Notification.create({
      message: `Your Contribution of ${contribution.Contribution_amount} credits to "${contribution.campaign_title}" was approved by ${req.user.display_name}.`,
      toEmail: contribution.Supporter_email,
      actionRoute: '/dashboard/supporter',
      time: new Date()
    });

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve contribution.', error: error.message });
  }
};

exports.rejectContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found.' });
    }

    if (contribution.creator_email !== req.user.user_email) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    contribution.status = 'rejected';
    await contribution.save();

    // Refund credits to supporter
    await User.findOneAndUpdate(
      { user_email: contribution.Supporter_email },
      { $inc: { credits: contribution.Contribution_amount } }
    );

    // Notify supporter
    await Notification.create({
      message: `Your Contribution of ${contribution.Contribution_amount} credits to "${contribution.campaign_title}" was rejected by ${req.user.display_name}. Credits have been refunded.`,
      toEmail: contribution.Supporter_email,
      actionRoute: '/dashboard/supporter',
      time: new Date()
    });

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject contribution.', error: error.message });
  }
};

exports.getMyContributions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { Supporter_email: req.user.user_email };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [contributions, total] = await Promise.all([
      Contribution.find(filter).sort({ current_date: -1 }).skip(skip).limit(Number(limit)),
      Contribution.countDocuments(filter)
    ]);

    res.json({
      contributions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contributions.', error: error.message });
  }
};

exports.getPendingContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({
      creator_email: req.user.user_email,
      status: 'pending'
    }).sort({ current_date: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending contributions.', error: error.message });
  }
};

exports.getApprovedContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({
      Supporter_email: req.user.user_email,
      status: 'approved'
    }).sort({ current_date: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved contributions.', error: error.message });
  }
};

exports.getSupporterStats = async (req, res) => {
  try {
    const email = req.user.user_email;
    const [totalContributions, pendingContributions, approvedResult] = await Promise.all([
      Contribution.countDocuments({ Supporter_email: email }),
      Contribution.countDocuments({ Supporter_email: email, status: 'pending' }),
      Contribution.aggregate([
        { $match: { Supporter_email: email, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$Contribution_amount' } } }
      ])
    ]);

    const totalContributed = approvedResult.length > 0 ? approvedResult[0].total : 0;

    res.json({
      totalContributions,
      pendingContributions,
      totalContributed
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats.', error: error.message });
  }
};
