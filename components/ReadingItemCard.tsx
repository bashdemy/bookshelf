'use client';

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
    <article 
      className="group relative flex h-full flex-col overflow-hidden p-6 transition-all"
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
      <div className="relative flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
                style={{ 
                  borderRadius: 'var(--radius-full)',
                  background: item.type === 'book' ? 'var(--color-accent-blush)' : 'var(--color-accent-lavender)',
                  color: 'var(--color-accent-plum)',
                }}
              >
                {getTypeLabel(item.type)}
              </span>
              {item.rating && (
                <span className="text-base leading-none" style={{ color: 'var(--color-primary)' }}>
                  {renderRatingHearts(item.rating)}
                </span>
              )}
            </div>
            <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-snug" style={{ color: 'var(--color-foreground)' }}>
              {item.title}
            </h3>
          </div>
        </div>

        <div className="mb-4 flex-1 space-y-2 text-sm leading-relaxed">
          {item.author && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Author:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{item.author}</span>
            </div>
          )}
          {item.publication && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Publication:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{item.publication}</span>
            </div>
          )}
          {yearAndPages && (
            <p style={{ color: 'var(--color-foreground-secondary)' }}>{yearAndPages}</p>
          )}
          {item.genre && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Genre:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{item.genre}</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t pt-4" style={{ borderColor: 'var(--color-divider)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
            Read on <span style={{ color: 'var(--color-secondary)' }}>{formatReadDate(item.readDate)}</span>
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    background: 'var(--color-accent-lavender)',
                    color: 'var(--color-accent-plum)',
                  }}
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
