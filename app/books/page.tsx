import { getBooksByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';

export default async function BooksPage() {
  const books = await getBooksByUser('bashdemy');

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ReadingSection
        title="Books"
        items={books}
        singularLabel="book"
        pluralLabel="books"
      />
    </main>
  );
}

