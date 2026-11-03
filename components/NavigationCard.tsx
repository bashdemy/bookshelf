'use client';

import Link from 'next/link';

interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  accentColor?: 'primary' | 'secondary';
}

export default function NavigationCard({ 
  href, 
  icon, 
  title, 
  description,
}: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="bookplate group relative flex flex-col items-center p-6 text-center transition-all active:translate-y-0 hover:-translate-y-1"
      style={{ 
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-3 text-3xl transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="mb-1 text-base font-serif font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
        {title}
      </h3>
      <p className="text-xs font-serif leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
        {description}
      </p>
      <span className="mt-3 text-[10px] uppercase font-serif tracking-widest gold-text opacity-0 group-hover:opacity-100 transition-opacity">
        Open Chapter →
      </span>
    </Link>
  );
}
