'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Wallet, DollarSign, CreditCard } from 'lucide-react';

export default function WithdrawalsPage() {
  const [earnings, setEarnings] = useState(null);
  const [form, setForm] = useState({ withdrawal_credit: '', payment_system: 'Stripe', account_number: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await api.getCreatorEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credits = Number(form.withdrawal_credit);

    if (!credits || credits < 200) {
      toast.error('Minimum withdrawal is 200 credits ($10)');
      return;
    }

    if (credits > earnings.availableCredits) {
      toast.error('Insufficient credits');
      return;
    }

    if (!form.account_number) {
      toast.error('Account number is required');
      return;
    }

    setSubmitting(true);
    try {
      await api.createWithdrawal({
        withdrawal_credit: credits,
        payment_system: form.payment_system,
        account_number: form.account_number,
      });
      toast.success('Withdrawal request submitted!');
      setForm({ withdrawal_credit: '', payment_system: 'Stripe', account_number: '' });
      fetchEarnings();
    } catch (error) {
      toast.error(error.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-32 bg-gray-200 rounded-xl" /><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  }

  const calculatedAmount = form.withdrawal_credit ? (Number(form.withdrawal_credit) / 20).toFixed(2) : '0.00';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>

      {/* Earnings Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card text-center">
          <p className="text-sm text-gray-500">Total Raised</p>
          <p className="text-2xl font-bold text-primary-600">{earnings?.totalRaised || 0}</p>
          <p className="text-xs text-gray-400">credits</p>
        </div>
        <div className="dashboard-card text-center">
          <p className="text-sm text-gray-500">Available to Withdraw</p>
          <p className="text-2xl font-bold text-emerald-600">{earnings?.availableCredits || 0}</p>
          <p className="text-xs text-gray-400">credits</p>
        </div>
        <div className="dashboard-card text-center">
          <p className="text-sm text-gray-500">Withdrawal Amount</p>
          <p className="text-2xl font-bold text-accent-600">${earnings?.withdrawalAmount?.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-400">20 credits = $1</p>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="dashboard-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h2>
        <p className="text-sm text-gray-500 mb-4">Minimum withdrawal: 200 credits ($10). Rate: 20 credits = $1.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Credits to Withdraw</label>
            <input
              type="number"
              value={form.withdrawal_credit}
              onChange={(e) => setForm({ ...form, withdrawal_credit: e.target.value })}
              className="input-field"
              min={200}
              max={earnings?.availableCredits || 0}
              placeholder="Minimum 200 credits"
              required
            />
          </div>

          <div>
            <label className="label">Withdrawal Amount ($)</label>
            <input
              type="text"
              value={`$${calculatedAmount}`}
              className="input-field bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="label">Payment System</label>
            <select
              value={form.payment_system}
              onChange={(e) => setForm({ ...form, payment_system: e.target.value })}
              className="input-field"
            >
              <option value="Stripe">Stripe</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="label">Account Number</label>
            <input
              type="text"
              value={form.account_number}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              className="input-field"
              placeholder="Enter your account number"
              required
            />
          </div>

          {(earnings?.availableCredits || 0) < 200 ? (
            <p className="text-red-500 text-sm font-medium">Insufficient credit</p>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Processing...' : 'Withdraw'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
