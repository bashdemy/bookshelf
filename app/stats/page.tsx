import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import { getCurrentUserId } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const userId = await getCurrentUserId();
  const books = await getBooksByUser(userId);
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          Statistics and Analytics
        </h1>
        <p className="mt-2" style={{ color: 'var(--color-foreground-secondary)' }}>
          View your reading statistics & insights
        </p>
      </div>
      <StatsSection books={books} articles={articles} />
    </main>
  );
}

