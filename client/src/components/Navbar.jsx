'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/utils/api';
import { Menu, X, Bell, ChevronDown, LogOut, User, CreditCard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        api.getNotifications(),
        api.getUnreadCount()
      ]);
      setNotifications(notifs);
      setUnreadCount(count.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      await api.markNotificationsRead();
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CrowdPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              Explore
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
                  Dashboard
                </Link>

                {/* Credits */}
                <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full">
                  <CreditCard className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold text-primary-700">{user.credits} credits</span>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <span className="text-xs text-gray-500">{notifications.length} total</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-gray-500 text-sm">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <Link
                              key={notif._id}
                              href={notif.actionRoute || '#'}
                              className={`block p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                              onClick={() => setShowNotifications(false)}
                            >
                              <p className="text-sm text-gray-700">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.time).toLocaleDateString()}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.display_name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Register
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Join as Developer
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="pt-3 space-y-2">
              <Link href="/explore" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>
                Explore
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600">{user.credits} credits available</span>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-primary-500 font-medium hover:bg-primary-50 rounded-lg" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
