import { notFound } from 'next/navigation';
import { getUserByUsername, getCurrentUser } from '@/lib/auth-helpers';
import { getBooksByUser, getArticlesByUser } from '@/lib/reading-items';
import StatsSection from '@/components/StatsSection';
import ReadingSection from '@/components/ReadingSection';

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
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="mb-10 flex flex-col items-start justify-between gap-4 p-8 sm:flex-row sm:items-center"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-divider)',
          background: 'var(--color-paper)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center gap-4">
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt={profileUser.display_name}
              className="h-16 w-16 rounded-full object-cover"
              style={{ border: '2px solid var(--color-primary)' }}
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {profileUser.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
              {profileUser.display_name}&apos;s Bookshelf
            </h1>
            {profileUser.username && (
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                @{profileUser.username}
              </p>
            )}
          </div>
        </div>

        <div
          className="px-4 py-2 text-xs font-semibold"
          style={{
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent-blush)',
            color: 'var(--color-accent-plum)',
          }}
        >
          {isOwner ? '✨ Your Public Profile' : '🌐 Public Bookshelf'}
        </div>
      </div>

      <div className="mb-14">
        <StatsSection books={books} articles={articles} />
      </div>

      <ReadingSection
        title="Books"
        items={books}
        singularLabel="book"
        pluralLabel="books"
        canEdit={isOwner}
      />

      <ReadingSection
        title="Articles"
        items={articles}
        singularLabel="article"
        pluralLabel="articles"
        canEdit={isOwner}
      />
    </main>
  );
}
