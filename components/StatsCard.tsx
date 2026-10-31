'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div 
      className="p-5 transition-all"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-serif font-bold uppercase tracking-wider text-pink-700">
          {title}
        </p>
        {icon && (
          <span className="text-xl opacity-80">{icon}</span>
        )}
      </div>
      <p className="mb-1 text-3xl font-extrabold tracking-tight font-serif text-pink-950">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-pink-900/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}
