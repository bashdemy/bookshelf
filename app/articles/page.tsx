import { getArticlesByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';

export default async function ArticlesPage() {
  const articles = await getArticlesByUser('bashdemy');

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

