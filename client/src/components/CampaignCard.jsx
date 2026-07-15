'use client';

import Link from 'next/link';
import { Calendar, Target, TrendingUp } from 'lucide-react';

export default function CampaignCard({ campaign }) {
  const progress = campaign.funding_goal > 0
    ? Math.min((campaign.amount_raised / campaign.funding_goal) * 100, 100)
    : 0;

  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        {campaign.campaign_image_url ? (
          <img
            src={campaign.campaign_image_url}
            alt={campaign.campaign_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Target className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-gray-700 backdrop-blur-sm">
            {campaign.category}
          </span>
        </div>
        {daysLeft <= 7 && daysLeft > 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-red-500 text-white">
              {daysLeft} days left
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {campaign.campaign_title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">by {campaign.creator_name}</p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{campaign.amount_raised} raised</span>
            <span>{campaign.funding_goal} goal</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{daysLeft} days left</span>
          </div>
          <Link
            href={`/campaign/${campaign._id}`}
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
