'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Trash2, Check, X } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveReport(id);
      toast.success('Report resolved');
      fetchReports();
    } catch (error) {
      toast.error(error.message || 'Failed to resolve');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.dismissReport(id);
      toast.success('Report dismissed');
      fetchReports();
    } catch (error) {
      toast.error(error.message || 'Failed to dismiss');
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Are you sure you want to delete this reported campaign?')) return;
    try {
      await api.deleteReportedCampaign(id);
      toast.success('Campaign deleted and report resolved');
      fetchReports();
    } catch (error) {
      toast.error(error.message || 'Failed to delete campaign');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved': return <span className="badge badge-approved">Resolved</span>;
      case 'dismissed': return <span className="badge bg-gray-100 text-gray-700">Dismissed</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No reports yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Campaign</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="font-medium">{report.reporter_name}</td>
                  <td>{report.campaign_title}</td>
                  <td className="max-w-[200px] truncate text-gray-500">{report.reason}</td>
                  <td>{new Date(report.report_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteCampaign(report._id)} className="btn-danger text-xs px-3 py-1 flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                        <button onClick={() => handleDismiss(report._id)} className="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          Dismiss
                        </button>
                      </div>
                    )}
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
