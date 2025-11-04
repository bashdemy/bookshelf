import { ReadingItem, ReadingItemType } from '@/types';
import { formatReadDate } from '@/utils/date';

interface ReadingItemCardProps {
  item: ReadingItem;
}

const HEART_EMOJI = '❤️';
const BOOK_TYPE: ReadingItemType = 'book';
const BOOK_LABEL = '📖 Book';
const ARTICLE_LABEL = '✨ Article';

function formatYearAndPages(year?: number, pages?: number): string {
  const parts: string[] = [];
  if (year) parts.push(year.toString());
  if (pages) parts.push(`${pages} pages`);
  return parts.join(' • ');
}

function renderRatingHearts(rating: number): string {
  return HEART_EMOJI.repeat(rating);
}

function getTypeLabel(type: ReadingItemType): string {
  return type === BOOK_TYPE ? BOOK_LABEL : ARTICLE_LABEL;
}

export default function ReadingItemCard({ item }: ReadingItemCardProps) {
  const yearAndPages = formatYearAndPages(item.year, item.pages);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pink-200/70 bg-pink-100/90 shadow-sm transition-all hover:border-pink-300/80 hover:shadow-lg hover:shadow-pink-200/40 hover:bg-pink-200">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                {getTypeLabel(item.type)}
              </span>
              {item.rating && (
                <span className="text-base leading-none text-pink-500">
                  {renderRatingHearts(item.rating)}
                </span>
              )}
            </div>
            <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-snug text-pink-800 group-hover:text-pink-700">
              {item.title}
            </h3>
          </div>
        </div>

        <div className="mb-4 flex-1 space-y-2 text-sm leading-relaxed">
          {item.author && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-pink-600">Author:</span>
              <span className="text-pink-700">{item.author}</span>
            </div>
          )}
          {item.publication && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-pink-600">Publication:</span>
              <span className="text-pink-700">{item.publication}</span>
            </div>
          )}
          {yearAndPages && (
            <p className="text-pink-600">{yearAndPages}</p>
          )}
          {item.genre && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-pink-600">Genre:</span>
              <span className="text-pink-700">{item.genre}</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-pink-200/50 pt-4">
          <p className="text-xs font-medium text-pink-500">
            Read on <span className="text-pink-600">{formatReadDate(item.readDate)}</span>
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-pink-100 px-2.5 py-1 text-xs font-medium text-pink-700 transition-colors group-hover:bg-pink-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
