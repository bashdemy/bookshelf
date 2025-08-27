import { Suspense } from 'react';
import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">📚 Bookshelf</h1>
        <p className="text-center text-muted-foreground">
          A lightweight reading tracker
        </p>
      </header>

      <div className="space-y-8">
        <AddBookForm />
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Books</h2>
          <Suspense fallback={<div>Loading books...</div>}>
            <BookList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
