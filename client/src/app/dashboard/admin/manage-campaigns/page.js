'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await api.getCampaigns('limit=100');
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.deleteCampaign(id);
      toast.success('Campaign deleted!');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-approved">Approved</span>;
      case 'rejected': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Creator</th>
              <th>Category</th>
              <th>Status</th>
              <th>Raised</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td className="font-medium max-w-[200px] truncate">{campaign.campaign_title}</td>
                <td>{campaign.creator_name}</td>
                <td><span className="badge bg-gray-100 text-gray-700">{campaign.category}</span></td>
                <td>{getStatusBadge(campaign.status)}</td>
                <td>{campaign.amount_raised} credits</td>
                <td>
                  <button onClick={() => handleDelete(campaign._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
