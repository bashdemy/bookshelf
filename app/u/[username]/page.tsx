import { notFound } from 'next/navigation';
import { getUserByUsername, getCurrentUser } from '@/lib/auth-helpers';
import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import ReadingSection from '@/components/ReadingSection';
import InteractiveBookshelf from '@/components/InteractiveBookshelf';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isOwner = Boolean(currentUser?.id && currentUser.id === profileUser.id);

  const [books, articles] = await Promise.all([
    getBooksByUser(profileUser.id),
    getArticlesByUser(profileUser.id),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div
        className="bookplate mb-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center"
        style={{
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-4">
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt={profileUser.display_name}
              className="h-14 w-14 rounded-full object-cover"
              style={{ border: '2px solid rgba(212, 175, 55, 0.5)' }}
            />
          ) : (
            <div
              className="brass-plate flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold font-serif text-[#FFF8DC]"
            >
              {profileUser.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-[10px] font-serif uppercase tracking-widest text-[#8A4B58] flex items-center gap-1.5 mb-1">
              <span className="gold-text select-none">❦</span>
              <span>Ex Libris</span>
            </p>
            <h1 className="text-2xl font-bold font-serif tracking-tight text-[#5A2232]">
              {profileUser.display_name}&apos;s Bookshelf
            </h1>
            {profileUser.username && (
              <p className="text-xs font-serif text-[#8A4B58]">
                @{profileUser.username}
              </p>
            )}
          </div>
        </div>

        <div
          className="brass-plate rounded px-3.5 py-1 text-xs font-serif font-bold uppercase tracking-wider text-white shadow-xs"
        >
          {isOwner ? 'Your Archive' : 'Public Library'}
        </div>
      </div>

      <div className="mb-12">
        <StatsSection books={books} articles={articles} />
      </div>

      <div className="mb-12">
        <InteractiveBookshelf />
      </div>

      <ReadingSection
        title="Books on the Shelf"
        items={books}
        singularLabel="book"
        pluralLabel="books"
        canEdit={isOwner}
      />

      <ReadingSection
        title="Cataloged Articles"
        items={articles}
        singularLabel="article"
        pluralLabel="articles"
        canEdit={isOwner}
      />
    </main>
  );
}
