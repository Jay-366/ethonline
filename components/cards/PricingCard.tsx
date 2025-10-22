'use client';

import { Star, Users, TrendingUp } from 'lucide-react';
import React from 'react';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  category?: string;
  status?: string;
  rating?: number;
  users?: number;
  revenue?: string;
  trending?: boolean;
  isCreated?: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
  badge?: string;
}

export default function PricingCard({
  title,
  description,
  price,
  category,
  status,
  rating,
  users,
  revenue,
  trending,
  isCreated,
  onViewDetails,
  onEdit,
  badge,
}: PricingCardProps) {
  return (
    <div
      className="relative rounded-3xl p-6 cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1C1F2B 0%, #252a36 100%)',
        border: '1px solid rgba(251, 237, 224, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.3)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 237, 224, 0.15), 0 0 60px rgba(147, 112, 219, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.1)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(251, 237, 224, 0.08)';
      }}
      onClick={onViewDetails}
    >
      {/* Gradient background glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(147, 112, 219, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with badge */}
        <div className="flex items-center justify-between mb-4">
          {badge && (
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.3) 0%, rgba(251, 237, 224, 0.1) 100%)',
                color: '#FBede0',
              }}
            >
              {badge}
            </span>
          )}
          <div className="flex-1" />
          {trending && (
            <div
              className="px-2 py-1 rounded-lg flex items-center gap-1 text-xs"
              style={{
                backgroundColor: 'rgba(147, 112, 219, 0.2)',
                color: '#FBede0',
              }}
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>

        {/* Title and category */}
        <div className="mb-3">
          <h3 className="text-2xl font-bold mb-1" style={{ color: '#FBede0' }}>
            {title}
          </h3>
          {category && (
            <p className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
              {category}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm mb-6" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          {description}
        </p>

        {/* Price section */}
        <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(251, 237, 224, 0.1)' }}>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: '#FBede0' }}>
              {price}
            </span>
            {price.includes('/') && (
              <span className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                per month
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          {isCreated ? (
            <div className="space-y-3">
              {rating !== undefined && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: '#FBede0', fill: '#FBede0' }} />
                  <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Rating: <span style={{ color: '#FBede0' }}>{rating}</span>
                  </span>
                </div>
              )}
              {users !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#FBede0' }} />
                  <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Users: <span style={{ color: '#FBede0' }}>{users}</span>
                  </span>
                </div>
              )}
              {revenue && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: '#FBede0' }} />
                  <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Revenue: <span style={{ color: '#FBede0' }}>{revenue}</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ color: '#FBede0', fill: '#FBede0' }} />
                  <span className="text-sm" style={{ color: '#FBede0' }}>
                    {rating}
                  </span>
                </div>
              )}
              {users !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" style={{ color: '#FBede0' }} />
                  <span className="text-sm" style={{ color: '#FBede0' }}>
                    {users.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 ${isCreated ? 'flex-col-reverse' : ''}`}>
          <button
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.4) 0%, rgba(251, 237, 224, 0.1) 100%)',
              color: '#FBede0',
              border: '1px solid rgba(251, 237, 224, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.2)';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            {isCreated ? 'Edit' : 'View Details'}
          </button>
          {isCreated && (
            <button
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #9370db 0%, #b596d4 100%)',
                color: '#161823',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(147, 112, 219, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.();
              }}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
