import Link from 'next/link';
import { getReadingItemStats, getReadingItemsByUser } from '@/lib/reading-items';
import NavigationCard from '@/components/NavigationCard';
import ReadingItemCard from '@/components/ReadingItemCard';
import InteractiveBookshelf from '@/components/InteractiveBookshelf';
import { getCurrentUser } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id || 'bashdemy';
  const [stats, allItems] = await Promise.all([
    getReadingItemStats(userId),
    getReadingItemsByUser(userId),
  ]);
  const totalPages = stats.totalPages;
  const totalItems = stats.bookCount + stats.articleCount;
  const recentItems = allItems.slice(0, 3);

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: 'var(--color-foreground)' }}>
          Reading Journey & Archive
        </h1>
        <p className="mb-8 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--color-foreground-secondary)' }}>
          Catalog books and articles, analyze your reading habits, and curate your personal library.
        </p>
        
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NavigationCard
            href="/books"
            icon="📖"
            title="Books"
            description={`${stats.bookCount} ${stats.bookCount === 1 ? 'volume' : 'volumes'} read`}
          />
          
          <NavigationCard
            href="/articles"
            icon="✨"
            title="Articles"
            description={`${stats.articleCount} ${stats.articleCount === 1 ? 'article' : 'articles'} cataloged`}
          />
          
          <NavigationCard
            href="/stats"
            icon="📊"
            title="Statistics"
            description={`${totalPages.toLocaleString()} pages indexed`}
          />
        </div>
        
        <div
          className="flex flex-col items-center justify-between gap-4 p-5 sm:flex-row"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--paper)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="text-left">
            <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--color-foreground-secondary)' }}>
              Catalog Summary
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
              <span className="font-extrabold text-[#9E384D]">{totalItems}</span> total works •{' '}
              <span className="font-extrabold text-[#394A60]">{totalPages.toLocaleString()}</span> pages completed
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {user ? (
              <>
                <Link
                  href="/add"
                  className="rounded-full px-4 py-2 text-xs font-bold text-white transition-all active:translate-y-[1px]"
                  style={{
                    background: 'var(--color-primary)',
                    boxShadow: 'var(--shadow-button-primary)',
                  }}
                >
                  + Add Item
                </Link>
                {user.username && (
                  <Link
                    href={`/u/${user.username}`}
                    className="rounded-full px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-[#F2EDE4]"
                    style={{
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-foreground)',
                      background: 'var(--paper)',
                    }}
                  >
                    Public View ↗
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-bold text-white transition-all active:translate-y-[1px]"
                style={{
                  background: 'var(--color-primary)',
                  boxShadow: 'var(--shadow-button-primary)',
                }}
              >
                Sign In to Track Yours
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Physical Bookshelf */}
      <section className="mt-12 w-full">
        <InteractiveBookshelf />
      </section>

      {recentItems.length > 0 && (
        <section className="mt-14 w-full">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                Recent Additions
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                Latest items read and archived
              </p>
            </div>
            <Link
              href="/stats"
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View detailed statistics →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {recentItems.map((item) => (
              <ReadingItemCard key={item.id} item={item} canEdit={!!user} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
