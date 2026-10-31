import { ReadingItem } from '@/types';

export function calculateTotalPages(books: ReadingItem[]): number {
  return books.reduce((sum, book) => sum + (book.pages || 0), 0);
}

export function calculateAveragePagesPerBook(books: ReadingItem[]): number {
  const booksWithPages = books.filter((b) => b.pages && b.pages > 0);
  if (booksWithPages.length === 0) return 0;
  const total = booksWithPages.reduce((sum, b) => sum + (b.pages || 0), 0);
  return Math.round(total / booksWithPages.length);
}

export function calculateAverageRating(items: ReadingItem[]): number {
  const itemsWithRating = items.filter((item) => item.rating !== undefined);
  
  if (itemsWithRating.length === 0) {
    return 0;
  }
  
  const totalRating = itemsWithRating.reduce(
    (sum, item) => sum + (item.rating || 0),
    0
  );
  
  return totalRating / itemsWithRating.length;
}

export function formatItemCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export interface GenreStat {
  genre: string;
  count: number;
  percentage: number;
}

export function calculateGenreBreakdown(items: ReadingItem[]): GenreStat[] {
  const counts = new Map<string, number>();
  let totalWithGenre = 0;

  for (const item of items) {
    if (item.genre && item.genre.trim()) {
      const normalized = item.genre.trim();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
      totalWithGenre++;
    }
  }

  if (totalWithGenre === 0) return [];

  return Array.from(counts.entries())
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / totalWithGenre) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
}

export interface TagStat {
  tag: string;
  count: number;
}

export function calculateTagBreakdown(items: ReadingItem[]): TagStat[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    if (item.tags) {
      for (const tag of item.tags) {
        const clean = tag.trim().toLowerCase();
        if (clean) {
          counts.set(clean, (counts.get(clean) || 0) + 1);
        }
      }
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export interface RatingStat {
  rating: number;
  count: number;
  percentage: number;
}

export function calculateRatingDistribution(items: ReadingItem[]): RatingStat[] {
  const ratedItems = items.filter((item) => item.rating !== undefined && item.rating >= 1 && item.rating <= 5);
  const total = ratedItems.length;

  return [5, 4, 3, 2, 1].map((rating) => {
    const count = ratedItems.filter((item) => item.rating === rating).length;
    return {
      rating,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
}

export interface MonthlyActivityStat {
  monthKey: string;
  label: string;
  books: number;
  articles: number;
  total: number;
}

export function calculateMonthlyActivity(items: ReadingItem[]): MonthlyActivityStat[] {
  const map = new Map<string, { books: number; articles: number }>();

  for (const item of items) {
    if (!item.readDate) continue;
    const date = new Date(item.readDate);
    if (isNaN(date.getTime())) continue;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;

    const entry = map.get(key) || { books: 0, articles: 0 };
    if (item.type === 'book') {
      entry.books += 1;
    } else {
      entry.articles += 1;
    }
    map.set(key, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([monthKey, counts]) => {
      const [yearStr, monthStr] = monthKey.split('-');
      const date = new Date(Date.UTC(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1));
      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      });
      return {
        monthKey,
        label,
        books: counts.books,
        articles: counts.articles,
        total: counts.books + counts.articles,
      };
    });
}

export function getReadingHighlights(books: ReadingItem[], articles: ReadingItem[]) {
  const allItems = [...books, ...articles];
  const longestBook =
    books
      .filter((b) => b.pages && b.pages > 0)
      .sort((a, b) => (b.pages || 0) - (a.pages || 0))[0] || null;

  const mostRecentItem =
    allItems
      .slice()
      .sort((a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime())[0] || null;

  const topRatedCount = allItems.filter((item) => item.rating === 5).length;

  return {
    longestBook,
    mostRecentItem,
    topRatedCount,
  };
}
