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
      <div className="whimsical-card mb-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt={profileUser.display_name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-pink-300 shadow-xs"
            />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold font-serif text-white bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md"
            >
              {profileUser.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-1">
              <span>✦ Reader Shelf ✦</span>
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight text-pink-950">
              {profileUser.display_name}&apos;s Bookshelf
            </h1>
            {profileUser.username && (
              <p className="text-xs font-sans text-pink-700/80">
                @{profileUser.username}
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-full px-4 py-1 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-xs"
        >
          {isOwner ? 'Your Bookshelf' : 'Public Shelf'}
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
