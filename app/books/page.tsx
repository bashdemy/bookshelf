import { getBooksByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';
import InteractiveBookshelf from '@/components/InteractiveBookshelf';
import { getCurrentUser } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  const user = await getCurrentUser();
  const userId = user?.id || 'bashdemy';
  const books = await getBooksByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <InteractiveBookshelf />

      <ReadingSection
        title="Every Book on the Shelf"
        items={books}
        singularLabel="book"
        pluralLabel="books"
        canEdit={!!user}
      />
    </main>
  );
}
