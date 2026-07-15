'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import { BarChart3, TrendingUp, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, contributionsData] = await Promise.all([
        api.getCreatorStats(),
        api.getPendingContributions()
      ]);
      setStats(statsData);
      setPendingContributions(contributionsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveContribution(id);
      toast.success('Contribution approved!');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectContribution(id);
      toast.success('Contribution rejected and refunded.');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="dashboard-card animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.display_name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCampaigns || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeCampaigns || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalRaised || 0} credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Contributions */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Contributions to Review</h2>
          <span className="badge badge-pending">{pendingContributions.length} pending</span>
        </div>

        {pendingContributions.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No pending contributions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Supporter</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingContributions.map((contrib) => (
                  <tr key={contrib._id}>
                    <td className="font-medium">{contrib.Supporter_name}</td>
                    <td>{contrib.campaign_title}</td>
                    <td className="font-semibold text-primary-600">{contrib.Contribution_amount} credits</td>
                    <td>{new Date(contrib.current_date).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedContribution(contrib)}
                          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                        >
                          View
                        </button>
                        <button onClick={() => handleApprove(contrib._id)} className="btn-success text-xs px-3 py-1">
                          Approve
                        </button>
                        <button onClick={() => handleReject(contrib._id)} className="btn-danger text-xs px-3 py-1">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Contribution Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContribution(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Details</h3>
            <div className="space-y-3">
              <div><span className="text-gray-500 text-sm">Supporter:</span> <span className="font-medium">{selectedContribution.Supporter_name}</span></div>
              <div><span className="text-gray-500 text-sm">Campaign:</span> <span className="font-medium">{selectedContribution.campaign_title}</span></div>
              <div><span className="text-gray-500 text-sm">Amount:</span> <span className="font-semibold text-primary-600">{selectedContribution.Contribution_amount} credits</span></div>
              <div><span className="text-gray-500 text-sm">Date:</span> <span className="font-medium">{new Date(selectedContribution.current_date).toLocaleDateString()}</span></div>
              {selectedContribution.message && (
                <div><span className="text-gray-500 text-sm">Message:</span> <p className="text-gray-700 mt-1">{selectedContribution.message}</p></div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { handleApprove(selectedContribution._id); setSelectedContribution(null); }} className="btn-success flex-1">
                Approve
              </button>
              <button onClick={() => { handleReject(selectedContribution._id); setSelectedContribution(null); }} className="btn-danger flex-1">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
