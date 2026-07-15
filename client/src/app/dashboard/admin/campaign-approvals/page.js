'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function CampaignApprovalsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await api.getCampaigns('status=pending&limit=50');
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveCampaign(id);
      toast.success('Campaign approved!');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectCampaign(id);
      toast.success('Campaign rejected.');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Campaign Approvals</h1>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No pending campaigns to review.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Category</th>
                <th>Goal</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="font-medium max-w-[200px] truncate">{campaign.campaign_title}</td>
                  <td>{campaign.creator_name}</td>
                  <td><span className="badge bg-gray-100 text-gray-700">{campaign.category}</span></td>
                  <td>{campaign.funding_goal} credits</td>
                  <td>{new Date(campaign.deadline).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(campaign._id)} className="btn-success text-xs px-3 py-1">Approve</button>
                      <button onClick={() => handleReject(campaign._id)} className="btn-danger text-xs px-3 py-1">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
