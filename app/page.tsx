import { bashdemyBooks, bashdemyArticles } from '@/data/bashdemy';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatsSection from '@/components/StatsSection';
import ReadingSection from '@/components/ReadingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-100/70 to-pink-200/50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <StatsSection books={bashdemyBooks} articles={bashdemyArticles} />
        </div>

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
