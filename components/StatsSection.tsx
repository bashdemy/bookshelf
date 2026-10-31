import StatsCard from './StatsCard';
import { ReadingItem } from '@/types';
import {
  IconBooks,
  IconArticle,
  IconFileText,
  IconStarFilled,
} from '@tabler/icons-react';
import {
  calculateTotalPages,
  calculateAveragePagesPerBook,
  calculateAverageRating,
  calculateGenreBreakdown,
  calculateTagBreakdown,
  calculateRatingDistribution,
  calculateMonthlyActivity,
  getReadingHighlights,
} from '@/utils/statistics';
import { formatReadDate } from '@/utils/date';

interface StatsSectionProps {
  books: ReadingItem[];
  articles: ReadingItem[];
}

export default function StatsSection({ books, articles }: StatsSectionProps) {
  const totalPages = calculateTotalPages(books);
  const avgPagesPerBook = calculateAveragePagesPerBook(books);
  const allItems = [...books, ...articles];
  const averageRating = calculateAverageRating(allItems);
  const genreBreakdown = calculateGenreBreakdown(allItems);
  const tagBreakdown = calculateTagBreakdown(allItems);
  const ratingDistribution = calculateRatingDistribution(allItems);
  const monthlyActivity = calculateMonthlyActivity(allItems);
  const highlights = getReadingHighlights(books, articles);

  const maxMonthlyTotal = Math.max(...monthlyActivity.map((m) => m.total), 1);

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Books"
          value={books.length}
          subtitle={avgPagesPerBook > 0 ? `Avg ${avgPagesPerBook} pages / book` : 'Books read'}
          icon={<IconBooks size={22} className="text-pink-600" />}
        />
        <StatsCard
          title="Total Articles"
          value={articles.length}
          subtitle="Articles cataloged"
          icon={<IconArticle size={22} className="text-pink-600" />}
        />
        <StatsCard
          title="Total Pages"
          value={totalPages.toLocaleString()}
          subtitle="Pages across all volumes"
          icon={<IconFileText size={22} className="text-pink-600" />}
        />
        <StatsCard
          title="Avg Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
          subtitle={`${highlights.topRatedCount} five-star favorites`}
          icon={<IconStarFilled size={22} className="text-pink-500 fill-pink-500" />}
        />
      </div>

      {allItems.length > 0 && (
        <>
          {/* Highlights Row */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {highlights.longestBook && (
              <div
                className="p-5"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--paper)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p className="mb-1 text-[11px] font-serif font-bold uppercase tracking-wider text-pink-700">
                  The Thickest Tome
                </p>
                <h3 className="text-base font-bold font-serif text-pink-950 tracking-tight">
                  {highlights.longestBook.title}
                </h3>
                <p className="mt-1 text-xs text-pink-900/70">
                  {highlights.longestBook.author ? `by ${highlights.longestBook.author} • ` : ''}
                  <span className="font-semibold text-pink-600">
                    {highlights.longestBook.pages?.toLocaleString()} pages
                  </span>
                </p>
              </div>
            )}

            {highlights.mostRecentItem && (
              <div
                className="p-5"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--paper)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p className="mb-1 text-[11px] font-serif font-bold uppercase tracking-wider text-pink-700">
                  Just Finished
                </p>
                <h3 className="text-base font-bold font-serif text-pink-950 tracking-tight">
                  {highlights.mostRecentItem.title}
                </h3>
                <p className="mt-1 text-xs text-pink-900/70">
                  {highlights.mostRecentItem.type === 'book' ? '📖 Book' : '✨ Article'} • Finished on{' '}
                  <span className="font-semibold text-pink-950">
                    {formatReadDate(highlights.mostRecentItem.readDate)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Reading Activity Timeline */}
          {monthlyActivity.length > 0 && (
            <div
              className="p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--paper)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-pink-950">
                    Reading Velocity
                  </h3>
                  <p className="text-xs text-pink-900/70">
                    Monthly pace over time
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-pink-950">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm bg-pink-600"
                    />
                    Books
                  </span>
                  <span className="flex items-center gap-1.5 text-pink-950">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm bg-pink-400"
                    />
                    Articles
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {monthlyActivity.map((month) => {
                  const bookWidth = (month.books / maxMonthlyTotal) * 100;
                  const articleWidth = (month.articles / maxMonthlyTotal) * 100;
                  return (
                    <div key={month.monthKey} className="flex items-center gap-3 text-xs">
                      <span className="w-20 shrink-0 font-medium text-pink-900/70">
                        {month.label}
                      </span>
                      <div
                        className="flex h-5 flex-1 overflow-hidden rounded p-0.5 bg-pink-100/80 border border-pink-200"
                      >
                        {month.books > 0 && (
                          <div
                            style={{
                              width: `${bookWidth}%`,
                              background: 'var(--color-primary)',
                              borderRadius: month.articles === 0 ? '3px' : '3px 0 0 3px',
                            }}
                            title={`${month.books} book(s)`}
                          />
                        )}
                        {month.articles > 0 && (
                          <div
                            style={{
                              width: `${articleWidth}%`,
                              background: 'var(--color-secondary)',
                              borderRadius: month.books === 0 ? '3px' : '0 3px 3px 0',
                            }}
                            title={`${month.articles} article(s)`}
                          />
                        )}
                      </div>
                      <span className="w-14 shrink-0 text-right font-bold text-pink-950 font-mono">
                        {month.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Genre Breakdown & Rating Distribution */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Genre Breakdown */}
            <div
              className="p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--paper)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-pink-950">
                Favorite Genres & Rabbit Holes
              </h3>
              <p className="mb-4 text-xs text-pink-900/70">
                Where my reading hours actually go
              </p>

              {genreBreakdown.length === 0 ? (
                <p className="text-xs text-pink-900/70">
                  No genres recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {genreBreakdown.map((g) => (
                    <div key={g.genre}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold capitalize text-pink-950">
                          {g.genre}
                        </span>
                        <span className="font-medium text-pink-900/70">
                          {g.count} ({g.percentage}%)
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded bg-pink-100/80 border border-pink-200/60"
                      >
                        <div
                          className="h-full rounded bg-pink-600"
                          style={{
                            width: `${g.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Distribution */}
            <div
              className="p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--paper)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-pink-950">
                Scores & Ratings
              </h3>
              <p className="mb-4 text-xs text-pink-900/70">
                How generous I am with stars
              </p>

              <div className="space-y-3">
                {ratingDistribution.map((r) => (
                  <div key={r.rating} className="flex items-center gap-2.5 text-xs">
                    <span className="w-20 shrink-0 text-xs flex items-center text-pink-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <IconStarFilled key={i} size={11} className="fill-pink-500" />
                      ))}
                    </span>
                    <div
                      className="h-2 flex-1 overflow-hidden rounded bg-pink-100/80 border border-pink-200/60"
                    >
                      <div
                        className="h-full rounded bg-pink-500"
                        style={{
                          width: `${r.percentage}%`,
                        }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right font-medium text-pink-900/70 font-mono">
                      {r.count} ({r.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tags */}
          {tagBreakdown.length > 0 && (
            <div
              className="p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--paper)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-pink-950">
                Shelf Tags & Topics
              </h3>
              <p className="mb-3.5 text-xs text-pink-900/70">
                Most frequent themes across the books
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tagBreakdown.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: 'var(--color-tag-bg)',
                      color: 'var(--color-tag-text)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <span>#{t.tag}</span>
                    <span
                      className="rounded px-1.5 py-0.2 text-[10px] font-bold"
                      style={{
                        background: '#FFFFFF',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {t.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
