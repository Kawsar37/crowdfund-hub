'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';
import { CreditCard, Zap, Star, Crown } from 'lucide-react';

const packages = [
  { key: '100', credits: 100, price: 10, icon: CreditCard, popular: false },
  { key: '300', credits: 300, price: 25, icon: Zap, popular: true },
  { key: '800', credits: 800, price: 60, icon: Star, popular: false },
  { key: '1500', credits: 1500, price: 110, icon: Crown, popular: false },
];

export default function PurchaseCreditPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkg) => {
    setLoading(true);
    try {
      const { url } = await api.createCheckoutSession({ packageKey: pkg.key });
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h1>
        <p className="text-gray-500">Current balance: <span className="font-semibold text-primary-600">{user?.credits || 0} credits</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div key={pkg.key} className={`relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow ${pkg.popular ? 'ring-2 ring-primary-500' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}

              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${pkg.popular ? 'bg-primary-100' : 'bg-gray-100'}`}>
                <Icon className={`w-7 h-7 ${pkg.popular ? 'text-primary-600' : 'text-gray-600'}`} />
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">{pkg.credits}</div>
              <div className="text-sm text-gray-500 mb-4">credits</div>

              <div className="text-2xl font-bold text-primary-600 mb-4">${pkg.price}</div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}
              >
                {loading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
