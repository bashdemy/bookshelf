'use client';

import StatsCard from './StatsCard';
import { ReadingItem } from '@/types';
import {
  IconBooks,
  IconArticle,
  IconFileText,
  IconStarFilled,
  IconSparkles,
  IconHeart,
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
    <div className="space-y-8">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Books Read"
          value={books.length}
          subtitle={avgPagesPerBook > 0 ? `Avg ${avgPagesPerBook} pages / book` : 'Physical & digital'}
          icon={<IconBooks size={20} className="text-pink-600" />}
        />
        <StatsCard
          title="Articles Saved"
          value={articles.length}
          subtitle="Longforms & deep dives"
          icon={<IconArticle size={20} className="text-purple-600" />}
        />
        <StatsCard
          title="Total Pages"
          value={totalPages.toLocaleString()}
          subtitle="Pages of adventures read"
          icon={<IconFileText size={20} className="text-rose-600" />}
        />
        <StatsCard
          title="Average Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
          subtitle={`${highlights.topRatedCount} five-star favorites ⭐`}
          icon={<IconStarFilled size={20} className="text-amber-400" />}
        />
      </div>

      {allItems.length > 0 && (
        <>
          {/* Highlights Row */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {highlights.longestBook && (
              <div className="whimsical-card p-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2">
                  <IconSparkles size={12} className="text-pink-500" />
                  <span>The Longest Read</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-pink-950 tracking-tight">
                  {highlights.longestBook.title}
                </h3>
                <p className="mt-1 text-xs font-sans text-pink-700">
                  {highlights.longestBook.author ? `by ${highlights.longestBook.author} • ` : ''}
                  <span className="font-bold text-pink-600">
                    {highlights.longestBook.pages?.toLocaleString()} pages
                  </span>
                </p>
              </div>
            )}

            {highlights.mostRecentItem && (
              <div className="whimsical-card p-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
                  <IconHeart size={12} className="text-purple-500 fill-purple-500" />
                  <span>Just Finished</span>
                </div>
                <h3 className="text-lg font-bold font-serif text-pink-950 tracking-tight">
                  {highlights.mostRecentItem.title}
                </h3>
                <p className="mt-1 text-xs font-sans text-pink-700">
                  {highlights.mostRecentItem.type === 'book' ? '📖 Book' : '✨ Article'} • Completed on{' '}
                  <span className="font-semibold text-pink-950">
                    {formatReadDate(highlights.mostRecentItem.readDate)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Reading Activity Timeline */}
          {monthlyActivity.length > 0 && (
            <div className="whimsical-card p-6 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 pb-4">
                <div>
                  <h3 className="text-base font-bold font-serif text-pink-950 flex items-center gap-2">
                    <IconSparkles size={16} className="text-pink-500" />
                    <span>Reading Velocity</span>
                  </h3>
                  <p className="text-xs font-sans text-pink-600/80">
                    Monthly reading pace over time
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-sans font-semibold">
                  <span className="flex items-center gap-1.5 text-pink-900">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 shadow-2xs" />
                    Books
                  </span>
                  <span className="flex items-center gap-1.5 text-pink-900">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-2xs" />
                    Articles
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {monthlyActivity.map((month) => {
                  const bookWidth = (month.books / maxMonthlyTotal) * 100;
                  const articleWidth = (month.articles / maxMonthlyTotal) * 100;
                  return (
                    <div key={month.monthKey} className="flex items-center gap-3.5 text-xs font-sans">
                      <span className="w-20 shrink-0 font-medium text-pink-900/80">
                        {month.label}
                      </span>
                      <div className="flex h-5 flex-1 overflow-hidden rounded-full p-0.5 bg-pink-100/70 border border-pink-200/60 shadow-inner">
                        {month.books > 0 && (
                          <div
                            style={{
                              width: `${bookWidth}%`,
                            }}
                            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                            title={`${month.books} book(s)`}
                          />
                        )}
                        {month.articles > 0 && (
                          <div
                            style={{
                              width: `${articleWidth}%`,
                            }}
                            className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
                            title={`${month.articles} article(s)`}
                          />
                        )}
                      </div>
                      <span className="w-12 shrink-0 text-right font-bold text-pink-950 font-mono">
                        {month.total}
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
            <div className="whimsical-card p-6 sm:p-7">
              <h3 className="text-base font-bold font-serif text-pink-950 flex items-center gap-2">
                <IconSparkles size={16} className="text-pink-500" />
                <span>Favorite Genres</span>
              </h3>
              <p className="mb-4 text-xs font-sans text-pink-600/80">
                Topics and genres explored most often
              </p>

              {genreBreakdown.length === 0 ? (
                <p className="text-xs font-sans text-pink-400 italic">
                  No genres recorded yet.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {genreBreakdown.map((g) => (
                    <div key={g.genre} className="font-sans">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold capitalize text-pink-900">
                          {g.genre}
                        </span>
                        <span className="text-pink-500 font-medium">
                          {g.count} ({g.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-pink-100/70 border border-pink-200/50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500"
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
            <div className="whimsical-card p-6 sm:p-7">
              <h3 className="text-base font-bold font-serif text-pink-950 flex items-center gap-2">
                <IconSparkles size={16} className="text-pink-500" />
                <span>Star Ratings</span>
              </h3>
              <p className="mb-4 text-xs font-sans text-pink-600/80">
                How reads are rated on the shelf
              </p>

              <div className="space-y-3.5">
                {ratingDistribution.map((r) => (
                  <div key={r.rating} className="flex items-center gap-3 text-xs font-sans">
                    <span className="w-20 shrink-0 flex items-center text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <IconStarFilled key={i} size={13} />
                      ))}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-pink-100/70 border border-pink-200/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                        style={{
                          width: `${r.percentage}%`,
                        }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right font-medium text-pink-600 font-mono">
                      {r.count} ({r.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tags */}
          {tagBreakdown.length > 0 && (
            <div className="whimsical-card p-6 sm:p-7">
              <h3 className="text-base font-bold font-serif text-pink-950 flex items-center gap-2">
                <IconSparkles size={16} className="text-pink-500" />
                <span>Tags & Themes</span>
              </h3>
              <p className="mb-4 text-xs font-sans text-pink-600/80">
                Common themes across books and articles
              </p>
              <div className="flex flex-wrap gap-2">
                {tagBreakdown.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-sans font-medium bg-white/90 text-pink-800 border border-pink-200/80 shadow-2xs hover:bg-pink-100/60 transition-colors"
                  >
                    <span>#{t.tag}</span>
                    <span className="rounded-full px-1.5 py-0.2 text-[10px] font-bold bg-pink-100 text-pink-600">
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
