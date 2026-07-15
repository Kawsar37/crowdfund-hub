'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchContributions();
  }, [page]);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const data = await api.getMyContributions(`page=${page}&limit=10`);
      setContributions(data.contributions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>
          <p className="text-gray-500">{total} total contributions</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div>
      ) : contributions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No contributions yet. Explore campaigns to get started!</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Creator</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contributions.map((contrib) => (
                  <tr key={contrib._id}>
                    <td className="font-medium">{contrib.campaign_title}</td>
                    <td>{contrib.creator_name}</td>
                    <td className="font-semibold text-primary-600">{contrib.Contribution_amount} credits</td>
                    <td>{new Date(contrib.current_date).toLocaleDateString()}</td>
                    <td>{getStatusBadge(contrib.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50">
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 rounded-lg text-sm font-medium ${page === pageNum ? 'bg-primary-500 text-white' : 'border hover:bg-gray-50'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
