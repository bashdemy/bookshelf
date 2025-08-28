import { getBooks } from '@/lib/books';
import BookCard from './BookCard';
import type { Book } from '@/types/book';
import { BookOpen } from 'lucide-react';

export default async function BookList() {
  const books = await getBooks();

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-cute-gradient rounded-3xl border-2 border-primary/20">
          <BookOpen className="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-cute text-lg">
            No books yet. Add your first adorable book! 📚✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book: Book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
