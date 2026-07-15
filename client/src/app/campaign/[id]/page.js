'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { Calendar, Target, User, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const data = await api.getCampaignById(id);
      setCampaign(data);
    } catch (error) {
      toast.error('Campaign not found');
      router.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to contribute');
      router.push('/login');
      return;
    }

    if (user.role !== 'supporter') {
      toast.error('Only supporters can contribute');
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount < campaign.minimum_Contribution) {
      toast.error(`Minimum contribution is ${campaign.minimum_Contribution} credits`);
      return;
    }

    if (numAmount > user.credits) {
      toast.error('Insufficient credits. Please purchase more.');
      return;
    }

    setContributing(true);
    try {
      await api.createContribution({
        campaign_id: campaign._id,
        Contribution_amount: numAmount,
      });
      toast.success('Contribution submitted! Waiting for creator approval.');
      setAmount('');
      fetchCampaign();
    } catch (error) {
      toast.error(error.message || 'Contribution failed');
    } finally {
      setContributing(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    try {
      await api.createReport({ campaign_id: campaign._id, reason: reportReason });
      toast.success('Report submitted');
      setShowReport(false);
      setReportReason('');
    } catch (error) {
      toast.error(error.message || 'Failed to submit report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const progress = campaign.funding_goal > 0
    ? Math.min((campaign.amount_raised / campaign.funding_goal) * 100, 100)
    : 0;

  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const isExpired = daysLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* Campaign Image */}
        <div className="rounded-2xl overflow-hidden mb-8 bg-white shadow-md">
          {campaign.campaign_image_url ? (
            <img
              src={campaign.campaign_image_url}
              alt={campaign.campaign_title}
              className="w-full h-64 md:h-96 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Target className="w-20 h-20 text-white/30" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-primary-100 text-primary-700">{campaign.category}</span>
                <span className={`badge ${isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isExpired ? 'Ended' : 'Active'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.campaign_title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4" />
                <span>by {campaign.creator_name}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Campaign</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {campaign.campaign_story}
              </div>
            </div>

            {campaign.reward_info && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Rewards</h2>
                <p className="text-gray-600">{campaign.reward_info}</p>
              </div>
            )}

            {/* Report */}
            {user && user.role === 'supporter' && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                >
                  <Flag className="w-4 h-4" />
                  Report this campaign
                </button>
                {showReport && (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Why are you reporting this campaign?"
                    />
                    <button onClick={handleReport} className="btn-danger text-sm">
                      Submit Report
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-600">{campaign.amount_raised}</div>
                <div className="text-sm text-gray-500">raised of {campaign.funding_goal} credits</div>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-500">Funded</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{daysLeft}</div>
                  <div className="text-xs text-gray-500">Days Left</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Minimum contribution: <span className="font-semibold text-gray-700">{campaign.minimum_Contribution} credits</span>
              </div>

              {/* Contribution Form */}
              {user && user.role === 'supporter' && !isExpired && (
                <form onSubmit={handleContribute} className="space-y-3">
                  <div>
                    <label className="label">Your Contribution (credits)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={campaign.minimum_Contribution}
                      max={user.credits}
                      className="input-field"
                      placeholder={`Min ${campaign.minimum_Contribution}`}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Available: {user.credits} credits</p>
                  </div>
                  <button
                    type="submit"
                    disabled={contributing}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {contributing ? 'Contributing...' : 'Contribute Now'}
                  </button>
                </form>
              )}

              {!user && !isExpired && (
                <Link href="/login" className="w-full btn-primary block text-center">
                  Login to Contribute
                </Link>
              )}

              {isExpired && (
                <p className="text-center text-gray-500 text-sm">This campaign has ended</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
