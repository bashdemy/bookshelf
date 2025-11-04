interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-pink-200/70 bg-pink-100/90 p-6 shadow-sm transition-all hover:border-pink-300/80 hover:shadow-lg hover:shadow-pink-200/40 hover:bg-pink-200">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">
            {title}
          </p>
          {icon && (
            <span className="text-2xl opacity-70">{icon}</span>
          )}
        </div>
        <p className="mb-1 text-4xl font-bold tracking-tight text-pink-700">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-pink-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

