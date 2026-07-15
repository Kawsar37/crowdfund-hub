const Report = require('../models/Report');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');

exports.createReport = async (req, res) => {
  try {
    const { campaign_id, reason } = req.body;

    if (!campaign_id || !reason) {
      return res.status(400).json({ message: 'Campaign and reason are required.' });
    }

    const campaign = await Campaign.findById(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    const report = await Report.create({
      campaign_id,
      campaign_title: campaign.campaign_title,
      reporter_name: req.user.display_name,
      reporter_email: req.user.user_email,
      reason
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create report.', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ report_date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports.', error: error.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve report.', error: error.message });
  }
};

exports.dismissReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'dismissed' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to dismiss report.', error: error.message });
  }
};

exports.deleteReportedCampaign = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Delete the campaign
    await Campaign.findByIdAndDelete(report.campaign_id);

    // Notify the reporter
    await Notification.create({
      message: `The campaign "${report.campaign_title}" has been removed after review.`,
      toEmail: report.reporter_email,
      actionRoute: '/explore',
      time: new Date()
    });

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Campaign deleted and report resolved.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete campaign.', error: error.message });
  }
};
