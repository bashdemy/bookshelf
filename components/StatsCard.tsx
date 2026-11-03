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
      className="bookplate p-5 transition-all hover:-translate-y-0.5"
      style={{ 
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#8A4B58] flex items-center gap-1.5">
          <span className="gold-text select-none">❦</span>
          <span>{title}</span>
        </p>
        {icon && (
          <span className="opacity-80">{icon}</span>
        )}
      </div>
      <p className="mb-1 text-3xl font-bold tracking-tight font-serif text-[#5A2232]">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs font-serif text-[#8A4B58]/80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
