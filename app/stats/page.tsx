import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import { getCurrentUserId } from '@/lib/auth-helpers';
import { IconSparkles } from '@tabler/icons-react';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const userId = await getCurrentUserId();
  const books = await getBooksByUser(userId);
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-pink-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-2 shadow-2xs">
          <IconSparkles size={13} className="text-pink-500" />
          <span>Reading Statistics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-pink-950">
          Reading Habits & Velocity
        </h1>
        <p className="mt-1 text-xs font-sans text-pink-700/80 max-w-2xl">
          A breakdown of pace, page counts, favorite topics, and ratings across every volume on the shelf.
        </p>
      </div>
      <StatsSection books={books} articles={articles} />
    </main>
  );
}
