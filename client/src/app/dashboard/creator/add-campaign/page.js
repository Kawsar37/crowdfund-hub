'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';

const categories = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment', 'Music', 'Film', 'Games', 'Other'];

export default function AddCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    campaign_title: '',
    campaign_story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_Contribution: '',
    deadline: '',
    reward_info: '',
    campaign_image_url: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setForm({ ...form, campaign_image_url: data.data.url });
        toast.success('Image uploaded!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.campaign_title || !form.campaign_story || !form.funding_goal || !form.minimum_Contribution || !form.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.createCampaign(form);
      toast.success('Campaign submitted for review!');
      router.push('/dashboard/creator/my-campaigns');
    } catch (error) {
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Campaign</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
        {/* Campaign Image */}
        <div>
          <label className="label">Campaign Cover Image</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 transition-colors">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload'}</span>
            </label>
            {form.campaign_image_url && (
              <img src={form.campaign_image_url} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
            )}
          </div>
        </div>

        <div>
          <label className="label">Campaign Title *</label>
          <input
            type="text"
            name="campaign_title"
            value={form.campaign_title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Help us build a solar-powered water pump"
            required
          />
        </div>

        <div>
          <label className="label">Campaign Story *</label>
          <textarea
            name="campaign_story"
            value={form.campaign_story}
            onChange={handleChange}
            className="input-field"
            rows={6}
            placeholder="Tell the story of your campaign..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Funding Goal (credits) *</label>
            <input
              type="number"
              name="funding_goal"
              value={form.funding_goal}
              onChange={handleChange}
              className="input-field"
              min="1"
              placeholder="e.g., 1000"
              required
            />
          </div>

          <div>
            <label className="label">Minimum Contribution (credits) *</label>
            <input
              type="number"
              name="minimum_Contribution"
              value={form.minimum_Contribution}
              onChange={handleChange}
              className="input-field"
              min="1"
              placeholder="e.g., 10"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Reward Information</label>
          <textarea
            name="reward_info"
            value={form.reward_info}
            onChange={handleChange}
            className="input-field"
            rows={3}
            placeholder="What will supporters receive for pledging?"
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading || uploading} className="btn-primary disabled:opacity-50">
            {loading ? 'Creating...' : 'Add Campaign'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
