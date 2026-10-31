import { getBooksByUser } from '@/lib/reading-items';
import ReadingSection from '@/components/ReadingSection';
import { getCurrentUser } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  const user = await getCurrentUser();
  const userId = user?.id || 'bashdemy';
  const books = await getBooksByUser(userId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ReadingSection
        title="Books"
        items={books}
        singularLabel="book"
        pluralLabel="books"
        canEdit={!!user}
      />
    </main>
  );
}
