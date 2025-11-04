import { ReadingItem } from '@/types';

export function calculateTotalPages(books: ReadingItem[]): number {
  return books.reduce((sum, book) => sum + (book.pages || 0), 0);
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

