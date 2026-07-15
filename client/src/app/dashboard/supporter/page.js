'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export default function SupporterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, contributionsData] = await Promise.all([
        api.getSupporterStats(),
        api.getApprovedContributions()
      ]);
      setStats(statsData);
      setApprovedContributions(contributionsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Supporter Dashboard</h1>
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
              <p className="text-sm text-gray-500">Total Contributions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalContributions || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Contributions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingContributions || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Contributed</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalContributed || 0} credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Contributions */}
      <div className="dashboard-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved Contributions</h2>

        {approvedContributions.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No approved contributions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Creator</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvedContributions.slice(0, 10).map((contrib) => (
                  <tr key={contrib._id}>
                    <td className="font-medium">{contrib.campaign_title}</td>
                    <td className="font-semibold text-primary-600">{contrib.Contribution_amount} credits</td>
                    <td>{contrib.creator_name}</td>
                    <td><span className="badge badge-approved">Approved</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
