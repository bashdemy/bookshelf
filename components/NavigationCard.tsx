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
      className="group relative flex flex-col items-center p-6 text-center transition-all active:translate-y-0"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = '#D6CEBF';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-1 text-base font-bold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
        {title}
      </h3>
      <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
        {description}
      </p>
    </Link>
  );
}
