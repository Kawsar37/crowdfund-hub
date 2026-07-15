'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import {
  Home, Compass, PlusCircle, FileText, CreditCard, Wallet,
  Users, BarChart3, Flag, AlertTriangle, Clock, DollarSign, LogOut
} from 'lucide-react';

const creatorLinks = [
  { href: '/dashboard/creator', label: 'Home', icon: Home },
  { href: '/dashboard/creator/add-campaign', label: 'Add New Campaign', icon: PlusCircle },
  { href: '/dashboard/creator/my-campaigns', label: 'My Campaigns', icon: FileText },
  { href: '/dashboard/creator/withdrawals', label: 'Withdrawals', icon: Wallet },
  { href: '/dashboard/creator/payment-history', label: 'Payment History', icon: CreditCard },
];

const supporterLinks = [
  { href: '/dashboard/supporter', label: 'Home', icon: Home },
  { href: '/dashboard/supporter/explore', label: 'Explore Campaigns', icon: Compass },
  { href: '/dashboard/supporter/my-contributions', label: 'My Contributions', icon: FileText },
  { href: '/dashboard/supporter/purchase-credit', label: 'Purchase Credit', icon: CreditCard },
  { href: '/dashboard/supporter/payment-history', label: 'Payment History', icon: DollarSign },
];

const adminLinks = [
  { href: '/dashboard/admin', label: 'Home', icon: Home },
  { href: '/dashboard/admin/campaign-approvals', label: 'Campaign Approvals', icon: AlertTriangle },
  { href: '/dashboard/admin/withdrawal-requests', label: 'Withdrawal Requests', icon: Wallet },
  { href: '/dashboard/admin/manage-users', label: 'Manage Users', icon: Users },
  { href: '/dashboard/admin/manage-campaigns', label: 'Manage Campaigns', icon: BarChart3 },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: Flag },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = user?.role === 'creator' ? creatorLinks
    : user?.role === 'admin' ? adminLinks
    : supporterLinks;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">CrowdPulse</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {user?.photo_url ? (
              <img src={user.photo_url} alt={user.display_name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user?.display_name?.charAt(0)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.display_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="mt-3 bg-primary-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Available Credits</p>
            <p className="text-lg font-bold text-primary-600">{user?.credits || 0}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
