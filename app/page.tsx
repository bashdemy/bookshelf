import Link from 'next/link';
import { getReadingItemStats, getReadingItemsByUser } from '@/lib/reading-items';
import NavigationCard from '@/components/NavigationCard';
import ReadingItemCard from '@/components/ReadingItemCard';
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
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <p className="mb-8 text-xl" style={{ color: 'var(--color-foreground-secondary)' }}>
          Track your reading journey, discover new books and articles, and explore your reading statistics.
        </p>
        
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NavigationCard
            href="/books"
            icon="📖"
            title="Books"
            description={`${stats.bookCount} ${stats.bookCount === 1 ? 'book' : 'books'}`}
            accentColor="primary"
            accentBg="blush"
          />
          
          <NavigationCard
            href="/articles"
            icon="✨"
            title="Articles"
            description={`${stats.articleCount} ${stats.articleCount === 1 ? 'article' : 'articles'}`}
            accentColor="secondary"
            accentBg="lavender"
          />
          
          <NavigationCard
            href="/stats"
            icon="📊"
            title="Statistics"
            description={`${totalPages.toLocaleString()} pages`}
            accentColor="primary"
            accentBg="blush"
          />
        </div>
        
        <div
          className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-divider)',
            background: 'var(--color-paper)',
          }}
        >
          <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
            <span className="font-semibold">{totalItems}</span> items tracked •{' '}
            <span className="font-semibold">{totalPages.toLocaleString()}</span> pages read
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {user && (
              <Link
                href="/add"
                className="px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                + Add Item
              </Link>
            )}
            {user?.username && (
              <Link
                href={`/u/${user.username}`}
                className="px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-secondary)',
                  background: 'white',
                }}
              >
                Public Profile ↗
              </Link>
            )}
          </div>
        </div>
      </div>

      {recentItems.length > 0 && (
        <section className="mt-14 w-full">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
              Recent Reads
            </h2>
            <Link
              href="/stats"
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-secondary)' }}
            >
              View all insights →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentItems.map((item) => (
              <ReadingItemCard key={item.id} item={item} canEdit={!!user} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
