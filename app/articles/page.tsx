import { getArticlesByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';
import { getCurrentUserId } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const userId = await getCurrentUserId();
  const articles = await getArticlesByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ReadingSection
        title="Articles"
        items={articles}
        singularLabel="article"
        pluralLabel="articles"
      />
    </main>
  );
}

