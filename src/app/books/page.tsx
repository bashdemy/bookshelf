import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Books</h1>
        <p className="text-muted-foreground">
          Track your reading progress and manage your book collection.
        </p>
      </div>

      <div className="space-y-8">
        <AddBookForm />
        <BookList />
      </div>
    </div>
  );
}
