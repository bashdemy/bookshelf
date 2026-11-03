import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import { getCurrentUserId } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const userId = await getCurrentUserId();
  const books = await getBooksByUser(userId);
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b pb-6" style={{ borderColor: 'var(--color-divider)' }}>
        <p className="text-[11px] font-serif uppercase tracking-widest text-[#8A4B58] flex items-center gap-2 mb-1.5">
          <span className="gold-text select-none">❦</span>
          <span>Ex Libris • Statistical Ledger</span>
          <span className="gold-text select-none">❦</span>
        </p>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-[#5A2232]">
          Reading Velocity & Habits
        </h1>
        <p className="mt-1 text-xs font-serif text-[#8A4B58] max-w-2xl">
          A ledger of pace, leaf counts, favorite rabbit holes, and the breakdown of every physical volume and digital essay preserved in the archive.
        </p>
      </div>
      <StatsSection books={books} articles={articles} />
    </main>
  );
}

