import { bashdemyArticles } from '@/data/bashdemy';
import ReadingSection from '@/components/ReadingSection';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ReadingSection
        title="Articles"
        items={bashdemyArticles}
        singularLabel="article"
        pluralLabel="articles"
      />
    </main>
  );
}

