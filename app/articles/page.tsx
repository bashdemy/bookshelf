import { getArticlesByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';
import { getCurrentUser } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  const userId = user?.id || 'bashdemy';
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b pb-6" style={{ borderColor: 'var(--color-divider)' }}>
        <p className="text-[11px] font-serif uppercase tracking-widest text-[#8A4B58] flex items-center gap-2 mb-1.5">
          <span className="gold-text select-none">❦</span>
          <span>Ex Libris • Digital Folios & Longforms</span>
          <span className="gold-text select-none">❦</span>
        </p>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-[#5A2232]">
          Essays, Treatises & Deep Dives
        </h1>
        <p className="mt-1 text-xs font-serif text-[#8A4B58] max-w-2xl">
          Online essays, technical write-ups, and longform rabbit holes preserved with personal marginalia and reading dates.
        </p>
      </div>

      <ReadingSection
        title="Cataloged Articles"
        items={articles}
        singularLabel="article"
        pluralLabel="articles"
        canEdit={!!user}
      />
    </main>
  );
}
