const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createCampaign = async (req, res) => {
  try {
    const {
      campaign_title, campaign_story, category, funding_goal,
      minimum_Contribution, deadline, reward_info, campaign_image_url
    } = req.body;

    if (!campaign_title || !campaign_story || !category || !funding_goal || !minimum_Contribution || !deadline) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const campaign = await Campaign.create({
      campaign_title,
      campaign_story,
      category,
      funding_goal: Number(funding_goal),
      minimum_Contribution: Number(minimum_Contribution),
      deadline: new Date(deadline),
      reward_info: reward_info || '',
      campaign_image_url: campaign_image_url || '',
      creator_email: req.user.user_email,
      creator_name: req.user.display_name,
      status: 'pending'
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create campaign.', error: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const { status, category, search, sort, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { campaign_title: { $regex: search, $options: 'i' } },
        { campaign_story: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    let sortObj = { createdAt: -1 };
    if (sort === 'raised') sortObj = { amount_raised: -1 };
    if (sort === 'deadline') sortObj = { deadline: 1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Campaign.countDocuments(filter)
    ]);

    res.json({
      campaigns,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campaigns.', error: error.message });
  }
};

exports.getApprovedCampaigns = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'approved', deadline: { $gt: new Date() } };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { campaign_title: { $regex: search, $options: 'i' } },
        { campaign_story: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).sort({ amount_raised: -1 }).skip(skip).limit(Number(limit)),
      Campaign.countDocuments(filter)
    ]);

    res.json({
      campaigns,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campaigns.', error: error.message });
  }
};

exports.getTopCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'approved' })
      .sort({ amount_raised: -1 })
      .limit(6);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top campaigns.', error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campaign.', error: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { campaign_title, campaign_story, reward_info } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }
    if (campaign.creator_email !== req.user.user_email) {
      return res.status(403).json({ message: 'Not authorized to update this campaign.' });
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { campaign_title, campaign_story, reward_info },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update campaign.', error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Refund all approved contributions
    const approvedContributions = await Contribution.find({
      campaign_id: req.params.id,
      status: 'approved'
    });

    for (const contrib of approvedContributions) {
      await User.findOneAndUpdate(
        { user_email: contrib.Supporter_email },
        { $inc: { credits: contrib.Contribution_amount } }
      );
    }

    // Delete contributions for this campaign
    await Contribution.deleteMany({ campaign_id: req.params.id });
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: 'Campaign deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete campaign.', error: error.message });
  }
};

exports.approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    await Notification.create({
      message: `Your campaign "${campaign.campaign_title}" has been approved by the admin.`,
      toEmail: campaign.creator_email,
      actionRoute: '/dashboard/creator/my-campaigns',
      time: new Date()
    });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve campaign.', error: error.message });
  }
};

exports.rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    await Notification.create({
      message: `Your campaign "${campaign.campaign_title}" has been rejected by the admin.`,
      toEmail: campaign.creator_email,
      actionRoute: '/dashboard/creator/my-campaigns',
      time: new Date()
    });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject campaign.', error: error.message });
  }
};

exports.getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator_email: req.user.user_email })
      .sort({ deadline: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campaigns.', error: error.message });
  }
};

exports.getCreatorStats = async (req, res) => {
  try {
    const email = req.user.user_email;
    const [totalCampaigns, activeCampaigns, raisedResult] = await Promise.all([
      Campaign.countDocuments({ creator_email: email }),
      Campaign.countDocuments({ creator_email: email, deadline: { $gt: new Date() }, status: 'approved' }),
      Campaign.aggregate([
        { $match: { creator_email: email } },
        { $group: { _id: null, total: { $sum: '$amount_raised' } } }
      ])
    ]);

    const totalRaised = raisedResult.length > 0 ? raisedResult[0].total : 0;

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalRaised
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats.', error: error.message });
  }
};
