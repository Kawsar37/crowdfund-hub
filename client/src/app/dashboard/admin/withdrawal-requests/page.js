'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await api.getPendingWithdrawals();
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveWithdrawal(id);
      toast.success('Withdrawal approved and credits deducted!');
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Requests</h1>

      {withdrawals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No pending withdrawal requests.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Credits</th>
                <th>Amount</th>
                <th>Payment System</th>
                <th>Account</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {withdrawals.map((w) => (
                <tr key={w._id}>
                  <td className="font-medium">{w.creator_name}</td>
                  <td>{w.withdrawal_credit} credits</td>
                  <td className="font-semibold text-emerald-600">${w.withdrawal_amount}</td>
                  <td>{w.payment_system}</td>
                  <td className="text-gray-500">{w.account_number}</td>
                  <td>{new Date(w.withdraw_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleApprove(w._id)} className="btn-success text-xs px-3 py-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Payment Success
                    </button>
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
