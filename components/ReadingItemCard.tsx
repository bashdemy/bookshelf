import { ReadingItem, ReadingItemType } from '@/types';
import { formatReadDate } from '@/utils/date';

interface ReadingItemCardProps {
  item: ReadingItem;
}

const STAR_EMOJI = '⭐';
const BOOK_TYPE: ReadingItemType = 'book';
const BOOK_LABEL = '📚 Book';
const ARTICLE_LABEL = '📄 Article';

function formatYearAndPages(year?: number, pages?: number): string {
  const parts: string[] = [];
  if (year) parts.push(year.toString());
  if (pages) parts.push(`${pages} pages`);
  return parts.join(' • ');
}

function renderRatingStars(rating: number): string {
  return STAR_EMOJI.repeat(rating);
}

function getTypeLabel(type: ReadingItemType): string {
  return type === BOOK_TYPE ? BOOK_LABEL : ARTICLE_LABEL;
}

export default function ReadingItemCard({ item }: ReadingItemCardProps) {
  const yearAndPages = formatYearAndPages(item.year, item.pages);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {getTypeLabel(item.type)}
            </span>
            {item.rating && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {renderRatingStars(item.rating)}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {item.author && (
          <p>
            <span className="font-medium">Author:</span> {item.author}
          </p>
        )}
        {item.publication && (
          <p>
            <span className="font-medium">Publication:</span> {item.publication}
          </p>
        )}
        {yearAndPages && <p>{yearAndPages}</p>}
        {item.genre && (
          <p>
            <span className="font-medium">Genre:</span> {item.genre}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Read on {formatReadDate(item.readDate)}
        </p>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
