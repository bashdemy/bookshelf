import { bashdemyBooks } from '@/data/bashdemy';
import ReadingSection from '@/components/ReadingSection';

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ReadingSection
        title="Books"
        items={bashdemyBooks}
        singularLabel="book"
        pluralLabel="books"
      />
    </main>
  );
}

