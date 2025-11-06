import { getReadingItemStats } from '@/lib/reading-items';
import NavigationCard from '@/components/NavigationCard';
import { getCurrentUserId } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const userId = await getCurrentUserId();
  const stats = await getReadingItemStats(userId);
  const totalPages = stats.totalPages;
  const totalItems = stats.bookCount + stats.articleCount;

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <p className="mb-8 text-xl" style={{ color: 'var(--color-foreground-secondary)' }}>
          Track your reading journey, discover new books and articles, and explore your reading statistics.
        </p>
        
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NavigationCard
            href="/books"
            icon="📖"
            title="Books"
            description={`${stats.bookCount} books`}
            accentColor="primary"
            accentBg="blush"
          />
          
          <NavigationCard
            href="/articles"
            icon="✨"
            title="Articles"
            description={`${stats.articleCount} articles`}
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
        
        <div className="p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-divider)', background: 'var(--color-paper)' }}>
          <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
            <span className="font-semibold">{totalItems}</span> items tracked •{' '}
            <span className="font-semibold">{totalPages.toLocaleString()}</span> pages read
          </p>
        </div>
      </div>
    </main>
  );
}
