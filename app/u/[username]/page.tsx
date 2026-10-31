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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="mb-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          background: 'var(--paper)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-4">
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt={profileUser.display_name}
              className="h-14 w-14 rounded-full object-cover"
              style={{ border: '2px solid var(--color-border)' }}
            />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              {profileUser.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
              {profileUser.display_name}&apos;s Bookshelf
            </h1>
            {profileUser.username && (
              <p className="text-xs font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>
                @{profileUser.username}
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: isOwner ? 'var(--color-primary-soft)' : '#EFEBE2',
            color: isOwner ? 'var(--color-primary-text)' : 'var(--color-foreground-secondary)',
          }}
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
