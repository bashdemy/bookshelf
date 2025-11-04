import { bashdemyBooks, bashdemyArticles } from '@/data/bashdemy';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatsSection from '@/components/StatsSection';
import ReadingSection from '@/components/ReadingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatsSection books={bashdemyBooks} articles={bashdemyArticles} />

        <ReadingSection
          title="Books"
          items={bashdemyBooks}
          singularLabel="book"
          pluralLabel="books"
        />

        <ReadingSection
          title="Articles"
          items={bashdemyArticles}
          singularLabel="article"
          pluralLabel="articles"
        />
      </main>

      <Footer />
    </div>
  );
}
