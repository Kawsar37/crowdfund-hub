'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function CreatorPaymentHistoryPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await api.getMyWithdrawals();
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

      {withdrawals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No withdrawal history yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Credits</th>
                <th>Amount</th>
                <th>Payment System</th>
                <th>Account</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {withdrawals.map((w) => (
                <tr key={w._id}>
                  <td>{new Date(w.withdraw_date).toLocaleDateString()}</td>
                  <td className="font-semibold">{w.withdrawal_credit} credits</td>
                  <td className="font-semibold text-emerald-600">${w.withdrawal_amount}</td>
                  <td>{w.payment_system}</td>
                  <td className="text-gray-500">{w.account_number}</td>
                  <td>{getStatusBadge(w.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
