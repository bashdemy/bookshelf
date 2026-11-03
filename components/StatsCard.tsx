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
    <div className="whimsical-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-sans font-bold uppercase tracking-wider text-pink-700/90 flex items-center gap-1.5">
          <span>{title}</span>
        </p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100/80 text-pink-600 shadow-2xs">
            {icon}
          </span>
        )}
      </div>
      <p className="mb-1 text-3xl sm:text-4xl font-bold tracking-tight font-serif text-pink-950">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs font-sans text-pink-600/80 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
