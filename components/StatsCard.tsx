'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div 
      className="group relative overflow-hidden p-6 transition-all"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-divider)',
        background: 'var(--color-paper)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        e.currentTarget.style.background = 'var(--color-accent-blush)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.background = 'var(--color-paper)';
      }}
    >
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-secondary)' }}>
            {title}
          </p>
          {icon && (
            <span className="text-2xl opacity-70">{icon}</span>
          )}
        </div>
        <p className="mb-1 text-4xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

