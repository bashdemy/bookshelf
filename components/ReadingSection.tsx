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
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatItemCount(items.length, singularLabel, pluralLabel)}
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

