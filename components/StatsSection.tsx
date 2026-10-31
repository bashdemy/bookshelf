import StatsCard from './StatsCard';
import { ReadingItem } from '@/types';
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Books"
          value={books.length}
          subtitle={avgPagesPerBook > 0 ? `Avg ${avgPagesPerBook} pages/book` : 'Books read'}
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
          subtitle="Pages read across books"
          icon="📄"
        />
        <StatsCard
          title="Avg Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
          subtitle={`${highlights.topRatedCount} five-heart favorites`}
          icon="❤️"
        />
      </div>

      {allItems.length > 0 && (
        <>
          {/* Highlights Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {highlights.longestBook && (
              <div
                className="p-6"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-divider)',
                  background: 'var(--color-paper)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-foreground-secondary)' }}
                >
                  🏆 Longest Book Read
                </p>
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {highlights.longestBook.title}
                </h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                  {highlights.longestBook.author ? `by ${highlights.longestBook.author} • ` : ''}
                  <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {highlights.longestBook.pages?.toLocaleString()} pages
                  </span>
                </p>
              </div>
            )}

            {highlights.mostRecentItem && (
              <div
                className="p-6"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-divider)',
                  background: 'var(--color-paper)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-foreground-secondary)' }}
                >
                  🕰️ Most Recent Read
                </p>
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {highlights.mostRecentItem.title}
                </h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                  {highlights.mostRecentItem.type === 'book' ? '📖 Book' : '✨ Article'} • Read on{' '}
                  <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
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
                border: '1px solid var(--color-divider)',
                background: 'var(--color-paper)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    Reading Activity Over Time
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Items completed by month
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: 'var(--color-primary)' }}
                    />
                    Books
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: 'var(--color-secondary)' }}
                    />
                    Articles
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {monthlyActivity.map((month) => {
                  const bookWidth = (month.books / maxMonthlyTotal) * 100;
                  const articleWidth = (month.articles / maxMonthlyTotal) * 100;
                  return (
                    <div key={month.monthKey} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-24 shrink-0 font-medium"
                        style={{ color: 'var(--color-foreground-secondary)' }}
                      >
                        {month.label}
                      </span>
                      <div
                        className="flex h-6 flex-1 overflow-hidden p-0.5"
                        style={{
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-background)',
                          border: '1px solid var(--color-divider)',
                        }}
                      >
                        {month.books > 0 && (
                          <div
                            style={{
                              width: `${bookWidth}%`,
                              background: 'var(--color-primary)',
                              borderTopLeftRadius: '9999px',
                              borderBottomLeftRadius: '9999px',
                              borderTopRightRadius: month.articles === 0 ? '9999px' : '0',
                              borderBottomRightRadius: month.articles === 0 ? '9999px' : '0',
                            }}
                            title={`${month.books} book(s)`}
                          />
                        )}
                        {month.articles > 0 && (
                          <div
                            style={{
                              width: `${articleWidth}%`,
                              background: 'var(--color-secondary)',
                              borderTopRightRadius: '9999px',
                              borderBottomRightRadius: '9999px',
                              borderTopLeftRadius: month.books === 0 ? '9999px' : '0',
                              borderBottomLeftRadius: month.books === 0 ? '9999px' : '0',
                            }}
                            title={`${month.articles} article(s)`}
                          />
                        )}
                      </div>
                      <span
                        className="w-16 shrink-0 text-right text-xs font-semibold"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {month.total} {month.total === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Genre Breakdown & Rating Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Genre Breakdown */}
            <div
              className="p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-divider)',
                background: 'var(--color-paper)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                Favorite Genres
              </h3>
              <p className="mb-5 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                Distribution of genres across your reading list
              </p>

              {genreBreakdown.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                  No genres recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {genreBreakdown.map((g) => (
                    <div key={g.genre}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium capitalize" style={{ color: 'var(--color-foreground)' }}>
                          {g.genre}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-secondary)' }}>
                          {g.count} ({g.percentage}%)
                        </span>
                      </div>
                      <div
                        className="h-2.5 w-full overflow-hidden"
                        style={{
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-accent-blush)',
                        }}
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${g.percentage}%`,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--gradient-primary)',
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
                border: '1px solid var(--color-divider)',
                background: 'var(--color-paper)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                Rating Distribution
              </h3>
              <p className="mb-5 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                Breakdown of ratings given to books and articles
              </p>

              <div className="space-y-3">
                {ratingDistribution.map((r) => (
                  <div key={r.rating} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-xs" style={{ color: 'var(--color-primary)' }}>
                      {'❤️'.repeat(r.rating)}
                    </span>
                    <div
                      className="h-2.5 flex-1 overflow-hidden"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-accent-lavender)',
                      }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${r.percentage}%`,
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-secondary)',
                        }}
                      />
                    </div>
                    <span
                      className="w-16 shrink-0 text-right text-xs font-semibold"
                      style={{ color: 'var(--color-foreground-secondary)' }}
                    >
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
                border: '1px solid var(--color-divider)',
                background: 'var(--color-paper)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                Top Topics & Tags
              </h3>
              <p className="mb-4 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                Most frequent tags across your books and articles
              </p>
              <div className="flex flex-wrap gap-2">
                {tagBreakdown.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-accent-lavender)',
                      color: 'var(--color-accent-plum)',
                    }}
                  >
                    <span>#{t.tag}</span>
                    <span
                      className="px-2 py-0.5 text-xs font-bold"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-paper)',
                        color: 'var(--color-secondary)',
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
