import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-cute mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          📚 My Bookshelf
        </h1>
        <p className="text-lg text-muted-foreground font-cute">
          Track your reading progress and manage your adorable book collection!
          ✨
        </p>
      </div>

      <div className="space-y-8">
        <AddBookForm />
        <BookList />
      </div>
    </div>
  );
}
