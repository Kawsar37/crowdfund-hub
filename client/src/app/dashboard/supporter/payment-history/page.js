'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

function PaymentHistoryContent() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const fetchPayments = async () => {
    try {
      const data = await api.getMyPayments();
      setPayments(Array.isArray(data) ? data : data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      toast.success('Payment successful! Verifying...');
      // Call verify-session endpoint to ensure credits are added (fallback if webhook fails)
      api.verifySession(sessionId)
        .then(async (result) => {
          await refreshUser();
          await fetchPayments();
          if (result.alreadyProcessed) {
            toast.success('Payment confirmed!');
          } else {
            toast.success(`${result.credits} credits added to your account!`);
          }
        })
        .catch((err) => {
          console.error('Session verification failed:', err);
          toast.error('Having trouble verifying payment. Please refresh in a moment.');
          fetchPayments();
        });
    } else {
      fetchPayments();
    }
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No payment history yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Package</th>
                <th>Credits</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="font-medium">{payment.package_name}</td>
                  <td className="font-semibold text-primary-600">{payment.credits_purchased} credits</td>
                  <td>${payment.amount}</td>
                  <td>
                    <span className={`badge ${payment.status === 'completed' ? 'badge-approved' : payment.status === 'failed' ? 'badge-rejected' : 'badge-pending'}`}>
                      {payment.status}
                    </span>
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

export default function SupporterPaymentHistoryPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded" />)}</div>}>
      <PaymentHistoryContent />
    </Suspense>
  );
}
