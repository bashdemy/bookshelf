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
          subtitle={avgPagesPerBook > 0 ? `Avg ${avgPagesPerBook} pages / book` : 'Volumes preserved'}
          icon={<IconBooks size={22} className="text-[#9E384D]" />}
        />
        <StatsCard
          title="Total Articles"
          value={articles.length}
          subtitle="Essays & treatises cataloged"
          icon={<IconArticle size={22} className="text-[#C5A059]" />}
        />
        <StatsCard
          title="Total Pages"
          value={totalPages.toLocaleString()}
          subtitle="Leaves across all tomes"
          icon={<IconFileText size={22} className="text-[#9E384D]" />}
        />
        <StatsCard
          title="Avg Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
          subtitle={`${highlights.topRatedCount} five-star treasures`}
          icon={<IconStarFilled size={22} className="text-[#D4AF37] fill-[#D4AF37]" />}
        />
      </div>

      {allItems.length > 0 && (
        <>
          {/* Highlights Row */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {highlights.longestBook && (
              <div
                className="bookplate p-5"
                style={{
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p className="mb-1 text-[10px] font-serif font-bold uppercase tracking-widest text-[#8A4B58] flex items-center gap-1.5">
                  <span className="gold-text">❦</span>
                  <span>The Thickest Tome</span>
                </p>
                <h3 className="text-base font-semibold font-serif text-[#5A2232] tracking-tight">
                  {highlights.longestBook.title}
                </h3>
                <p className="mt-1 text-xs font-serif text-[#8A4B58]">
                  {highlights.longestBook.author ? `by ${highlights.longestBook.author} • ` : ''}
                  <span className="font-semibold text-[#9E384D]">
                    {highlights.longestBook.pages?.toLocaleString()} pages
                  </span>
                </p>
              </div>
            )}

            {highlights.mostRecentItem && (
              <div
                className="bookplate p-5"
                style={{
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p className="mb-1 text-[10px] font-serif font-bold uppercase tracking-widest text-[#8A4B58] flex items-center gap-1.5">
                  <span className="gold-text">❦</span>
                  <span>Just Finished</span>
                </p>
                <h3 className="text-base font-semibold font-serif text-[#5A2232] tracking-tight">
                  {highlights.mostRecentItem.title}
                </h3>
                <p className="mt-1 text-xs font-serif text-[#8A4B58]">
                  {highlights.mostRecentItem.type === 'book' ? '📖 Book' : '✨ Article'} • Completed on{' '}
                  <span className="font-semibold text-[#5A2232]">
                    {formatReadDate(highlights.mostRecentItem.readDate)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Reading Activity Timeline */}
          {monthlyActivity.length > 0 && (
            <div
              className="bookplate p-6"
              style={{
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--color-divider)' }}>
                <div>
                  <h3 className="text-sm font-semibold font-serif uppercase tracking-wider text-[#5A2232] flex items-center gap-2">
                    <span className="gold-text">❦</span>
                    <span>Reading Velocity</span>
                  </h3>
                  <p className="text-xs font-serif text-[#8A4B58]">
                    Monthly archival activity over time
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-serif font-medium">
                  <span className="flex items-center gap-1.5 text-[#5A2232]">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-xs"
                      style={{ background: 'linear-gradient(135deg, #9E384D 0%, #B84762 100%)' }}
                    />
                    Books
                  </span>
                  <span className="flex items-center gap-1.5 text-[#5A2232]">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-xs"
                      style={{ background: 'var(--gold-gradient)' }}
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
                    <div key={month.monthKey} className="flex items-center gap-3 text-xs">
                      <span className="w-20 shrink-0 font-serif font-medium text-[#8A4B58]">
                        {month.label}
                      </span>
                      <div
                        className="flex h-5 flex-1 overflow-hidden rounded p-0.5"
                        style={{
                          background: 'rgba(233, 207, 199, 0.35)',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'inset 0 1px 2px rgba(90, 34, 50, 0.05)',
                        }}
                      >
                        {month.books > 0 && (
                          <div
                            style={{
                              width: `${bookWidth}%`,
                              background: 'linear-gradient(90deg, #9E384D 0%, #B84762 100%)',
                              borderRadius: month.articles === 0 ? '2px' : '2px 0 0 2px',
                            }}
                            title={`${month.books} book(s)`}
                          />
                        )}
                        {month.articles > 0 && (
                          <div
                            style={{
                              width: `${articleWidth}%`,
                              background: 'linear-gradient(90deg, #C5A059 0%, #D4AF37 100%)',
                              borderRadius: month.books === 0 ? '2px' : '0 2px 2px 0',
                            }}
                            title={`${month.articles} article(s)`}
                          />
                        )}
                      </div>
                      <span className="w-14 shrink-0 text-right font-serif font-bold text-[#5A2232] font-mono">
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
              className="bookplate p-6"
              style={{
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-semibold font-serif uppercase tracking-wider text-[#5A2232] flex items-center gap-2">
                <span className="gold-text">❦</span>
                <span>Favorite Genres & Inquiries</span>
              </h3>
              <p className="mb-4 text-xs font-serif text-[#8A4B58]">
                Distribution of subject matters across the shelves
              </p>

              {genreBreakdown.length === 0 ? (
                <p className="text-xs font-serif text-[#8A4B58] italic">
                  No genres cataloged yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {genreBreakdown.map((g) => (
                    <div key={g.genre}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-serif font-semibold capitalize text-[#5A2232]">
                          {g.genre}
                        </span>
                        <span className="font-mono text-[11px] text-[#8A4B58]">
                          {g.count} ({g.percentage}%)
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded"
                        style={{
                          background: 'rgba(233, 207, 199, 0.4)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                        }}
                      >
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${g.percentage}%`,
                            background: 'linear-gradient(90deg, #9E384D 0%, #C5A059 100%)',
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
              className="bookplate p-6"
              style={{
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-semibold font-serif uppercase tracking-wider text-[#5A2232] flex items-center gap-2">
                <span className="gold-text">❦</span>
                <span>Critical Assessment</span>
              </h3>
              <p className="mb-4 text-xs font-serif text-[#8A4B58]">
                Star ratings assigned to volumes and essays
              </p>

              <div className="space-y-3">
                {ratingDistribution.map((r) => (
                  <div key={r.rating} className="flex items-center gap-2.5 text-xs">
                    <span className="w-20 shrink-0 text-xs flex items-center text-[#D4AF37]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <IconStarFilled key={i} size={11} className="fill-[#D4AF37]" />
                      ))}
                    </span>
                    <div
                      className="h-2 flex-1 overflow-hidden rounded"
                      style={{
                        background: 'rgba(233, 207, 199, 0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                      }}
                    >
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${r.percentage}%`,
                          background: 'linear-gradient(90deg, #D4AF37 0%, #E5C158 100%)',
                        }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right font-mono text-[11px] text-[#8A4B58]">
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
              className="bookplate p-6"
              style={{
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 className="text-sm font-semibold font-serif uppercase tracking-wider text-[#5A2232] flex items-center gap-2">
                <span className="gold-text">❦</span>
                <span>Shelf Tags & Common Threads</span>
              </h3>
              <p className="mb-3.5 text-xs font-serif text-[#8A4B58]">
                Recurring motifs and topics across the library
              </p>
              <div className="flex flex-wrap gap-2">
                {tagBreakdown.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-serif font-medium"
                    style={{
                      background: 'rgba(255, 250, 245, 0.9)',
                      color: 'var(--foreground)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      boxShadow: '0 1px 2px rgba(90, 34, 50, 0.04)',
                    }}
                  >
                    <span>#{t.tag}</span>
                    <span
                      className="rounded px-1.5 py-0.2 text-[10px] font-mono font-bold"
                      style={{
                        background: 'rgba(158, 56, 77, 0.1)',
                        color: '#9E384D',
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
