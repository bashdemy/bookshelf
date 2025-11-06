'use client';

import Link from 'next/link';

interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  accentColor?: 'primary' | 'secondary';
  accentBg?: 'blush' | 'lavender';
}

export default function NavigationCard({ 
  href, 
  icon, 
  title, 
  description, 
  accentColor = 'primary',
  accentBg = 'blush',
}: NavigationCardProps) {
  const colorVar = accentColor === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const bgVar = accentBg === 'blush' ? 'var(--color-accent-blush)' : 'var(--color-accent-lavender)';

  return (
    <Link
      href={href}
      className="group p-6 text-center transition-all"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-divider)',
        background: 'var(--color-paper)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        e.currentTarget.style.background = bgVar;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.background = 'var(--color-paper)';
      }}
    >
      <div className="mb-2 text-4xl">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold" style={{ color: colorVar }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>{description}</p>
    </Link>
  );
}

