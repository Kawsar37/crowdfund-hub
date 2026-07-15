const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const api = {
  // Auth
  register: (data) => apiCall('/auth/register', { method: 'POST', body: data }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: data }),
  googleLogin: (data) => apiCall('/auth/google-login', { method: 'POST', body: data }),
  getMe: () => apiCall('/auth/me'),

  // Campaigns
  getCampaigns: (params = '') => apiCall(`/campaigns?${params}`),
  getApprovedCampaigns: (params = '') => apiCall(`/campaigns/approved?${params}`),
  getTopCampaigns: () => apiCall('/campaigns/top'),
  getCampaignById: (id) => apiCall(`/campaigns/${id}`),
  createCampaign: (data) => apiCall('/campaigns', { method: 'POST', body: data }),
  updateCampaign: (id, data) => apiCall(`/campaigns/${id}`, { method: 'PUT', body: data }),
  deleteCampaign: (id) => apiCall(`/campaigns/${id}`, { method: 'DELETE' }),
  approveCampaign: (id) => apiCall(`/campaigns/${id}/approve`, { method: 'PATCH' }),
  rejectCampaign: (id) => apiCall(`/campaigns/${id}/reject`, { method: 'PATCH' }),
  getMyCampaigns: () => apiCall('/campaigns/my-campaigns'),
  getCreatorStats: () => apiCall('/campaigns/creator-stats'),

  // Contributions
  createContribution: (data) => apiCall('/contributions', { method: 'POST', body: data }),
  approveContribution: (id) => apiCall(`/contributions/${id}/approve`, { method: 'PATCH' }),
  rejectContribution: (id) => apiCall(`/contributions/${id}/reject`, { method: 'PATCH' }),
  getMyContributions: (params = '') => apiCall(`/contributions/my-contributions?${params}`),
  getPendingContributions: () => apiCall('/contributions/pending'),
  getApprovedContributions: () => apiCall('/contributions/approved'),
  getSupporterStats: () => apiCall('/contributions/supporter-stats'),

  // Withdrawals
  createWithdrawal: (data) => apiCall('/withdrawals', { method: 'POST', body: data }),
  getMyWithdrawals: () => apiCall('/withdrawals/my-withdrawals'),
  getPendingWithdrawals: () => apiCall('/withdrawals/pending'),
  approveWithdrawal: (id) => apiCall(`/withdrawals/${id}/approve`, { method: 'PATCH' }),
  getCreatorEarnings: () => apiCall('/withdrawals/earnings'),

  // Notifications
  getNotifications: () => apiCall('/notifications'),
  markNotificationsRead: () => apiCall('/notifications/mark-read', { method: 'PATCH' }),
  getUnreadCount: () => apiCall('/notifications/unread-count'),

  // Payments
  getCredits: () => apiCall('/payments/credits'),
  createCheckoutSession: (data) => apiCall('/payments/create-checkout-session', { method: 'POST', body: data }),
  dummyPayment: (data) => apiCall('/payments/dummy-payment', { method: 'POST', body: data }),
  getMyPayments: () => apiCall('/payments/my-payments'),
  getAllPayments: () => apiCall('/payments/all'),
  verifySession: (sessionId) => apiCall(`/payments/verify-session?session_id=${sessionId}`),

  // Users
  getAllUsers: () => apiCall('/users'),
  updateUserRole: (id, role) => apiCall(`/users/${id}/role`, { method: 'PATCH', body: { role } }),
  deleteUser: (id) => apiCall(`/users/${id}`, { method: 'DELETE' }),
  getAdminStats: () => apiCall('/users/admin-stats'),

  // Reports
  createReport: (data) => apiCall('/reports', { method: 'POST', body: data }),
  getAllReports: () => apiCall('/reports'),
  resolveReport: (id) => apiCall(`/reports/${id}/resolve`, { method: 'PATCH' }),
  dismissReport: (id) => apiCall(`/reports/${id}/dismiss`, { method: 'PATCH' }),
  deleteReportedCampaign: (id) => apiCall(`/reports/${id}/campaign`, { method: 'DELETE' }),
};

export default api;
