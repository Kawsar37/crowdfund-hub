'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import CampaignCard from '@/components/CampaignCard';
import { Search } from 'lucide-react';

const categories = ['All', 'Technology', 'Art', 'Community', 'Health', 'Education', 'Environment', 'Music', 'Film', 'Games'];

export default function SupporterExplorePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaigns();
  }, [page, category]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '12' });
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      const data = await api.getApprovedCampaigns(params.toString());
      setCampaigns(data.campaigns);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-gray-500">Discover and support amazing projects</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchCampaigns(); }} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns..." className="input-field pl-11" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse"><div className="h-48 bg-gray-200" /><div className="p-5 space-y-3"><div className="h-5 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div></div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12"><p className="text-gray-500">No campaigns found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => <CampaignCard key={campaign._id} campaign={campaign} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50">Prev</button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
