import { Suspense } from 'react';
import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg className="w-12 h-12 text-pink-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <svg className="w-6 h-6 text-dusty-500 absolute -top-1 -right-1 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-dusty-600 dark:from-pink-400 dark:to-dusty-400 bg-clip-text text-transparent mb-3">
          Bookshelf
        </h1>

      </header>

      <div className="space-y-12">
        <AddBookForm />
        
        <section className="animate-slide-up">
          <h2 className="text-3xl font-semibold mb-6 text-center text-foreground">
            My Collection
          </h2>
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          }>
            <BookList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
