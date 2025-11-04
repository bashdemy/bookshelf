import StatsCard from './StatsCard';
import { ReadingItem } from '@/types';
import { calculateTotalPages, calculateAverageRating } from '@/utils/statistics';

interface StatsSectionProps {
  books: ReadingItem[];
  articles: ReadingItem[];
}

export default function StatsSection({ books, articles }: StatsSectionProps) {
  const totalPages = calculateTotalPages(books);
  const allItems = [...books, ...articles];
  const averageRating = calculateAverageRating(allItems);

  return (
    <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Books"
        value={books.length}
        subtitle="Books read"
        icon="📖"
      />
      <StatsCard
        title="Total Articles"
        value={articles.length}
        subtitle="Articles read"
        icon="✨"
      />
      <StatsCard
        title="Total Pages"
        value={totalPages.toLocaleString()}
        subtitle="Pages read"
        icon="📄"
      />
      <StatsCard
        title="Avg Rating"
        value={averageRating.toFixed(1)}
        subtitle="Out of 5 stars"
        icon="❤️"
      />
    </div>
  );
}

