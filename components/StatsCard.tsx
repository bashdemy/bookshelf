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
      className="p-5 transition-all"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-foreground-secondary)' }}>
          {title}
        </p>
        {icon && (
          <span className="text-xl opacity-80">{icon}</span>
        )}
      </div>
      <p className="mb-1 text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
