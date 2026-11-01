import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import { getCurrentUserId } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const userId = await getCurrentUserId();
  const books = await getBooksByUser(userId);
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold font-serif tracking-tight text-pink-900">
          Reading Habits & Stats
        </h1>
        <p className="mt-1 text-xs font-serif text-pink-900/80">
          Pace, page counts, favorite rabbit holes, and the breakdown of everything on the shelves.
        </p>
      </div>
      <StatsSection books={books} articles={articles} />
    </main>
  );
}

