'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Edit2, Trash2, X } from 'lucide-react';

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editForm, setEditForm] = useState({ campaign_title: '', campaign_story: '', reward_info: '' });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await api.getMyCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.updateCampaign(editingCampaign._id, editForm);
      toast.success('Campaign updated!');
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign? All approved contributions will be refunded.')) return;

    try {
      await api.deleteCampaign(id);
      toast.success('Campaign deleted and contributions refunded.');
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
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Campaigns</h1>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No campaigns yet. Create your first campaign!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Raised</th>
                <th>Goal</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="font-medium max-w-[200px] truncate">{campaign.campaign_title}</td>
                  <td><span className="badge bg-gray-100 text-gray-700">{campaign.category}</span></td>
                  <td>{getStatusBadge(campaign.status)}</td>
                  <td className="font-semibold text-primary-600">{campaign.amount_raised}</td>
                  <td>{campaign.funding_goal}</td>
                  <td>{new Date(campaign.deadline).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setEditForm({
                            campaign_title: campaign.campaign_title,
                            campaign_story: campaign.campaign_story,
                            reward_info: campaign.reward_info || '',
                          });
                        }}
                        className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign._id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingCampaign(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Campaign</h3>
              <button onClick={() => setEditingCampaign(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={editForm.campaign_title}
                  onChange={(e) => setEditForm({ ...editForm, campaign_title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Story</label>
                <textarea
                  value={editForm.campaign_story}
                  onChange={(e) => setEditForm({ ...editForm, campaign_story: e.target.value })}
                  className="input-field"
                  rows={5}
                />
              </div>
              <div>
                <label className="label">Reward Info</label>
                <textarea
                  value={editForm.reward_info}
                  onChange={(e) => setEditForm({ ...editForm, reward_info: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
                <button onClick={() => setEditingCampaign(null)} className="btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
