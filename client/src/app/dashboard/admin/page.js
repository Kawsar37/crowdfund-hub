'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import { Users, UserCheck, CreditCard, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dashboard-card animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/2 mb-2" /><div className="h-6 bg-gray-200 rounded w-1/3" /></div>
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Supporters', value: stats?.totalSupporters || 0, icon: Users, color: 'primary' },
    { label: 'Total Creators', value: stats?.totalCreators || 0, icon: UserCheck, color: 'emerald' },
    { label: 'Total Credits', value: stats?.totalCredits || 0, icon: CreditCard, color: 'accent' },
    { label: 'Payments Processed', value: stats?.totalPayments || 0, icon: DollarSign, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.display_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard-card">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
