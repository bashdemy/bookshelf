import { ReadingItem } from '@/types';
import ReadingItemCard from './ReadingItemCard';
import { formatItemCount } from '@/utils/statistics';

interface ReadingSectionProps {
  title: string;
  items: ReadingItem[];
  singularLabel: string;
  pluralLabel: string;
}

export default function ReadingSection({
  title,
  items,
  singularLabel,
  pluralLabel,
}: ReadingSectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          {title}
        </h2>
        <span 
          className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold"
          style={{ 
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent-blush)',
            color: 'var(--color-accent-plum)',
          }}
        >
          <span>{formatItemCount(items.length, singularLabel, pluralLabel)}</span>
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ReadingItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

