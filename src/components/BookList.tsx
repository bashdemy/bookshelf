'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import type { Book } from '@/types/book';
import { BookOpen, Loader2 } from 'lucide-react';

export default function BookList() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/books/', { cache: 'no-store' });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
            details?: string;
          };
          throw new Error(data.details || data.error || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as Book[];
        if (active) setBooks(data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-destructive/10 rounded-3xl border-2 border-destructive/20">
          <p className="text-destructive font-cute text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (books === null) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-cute-gradient rounded-3xl border-2 border-primary/20 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-muted-foreground font-cute text-lg">
            Loading books…
          </p>
        </div>
      </div>
    );
  }

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
