import type { Book } from '@/db/schema';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const statusColors = {
    reading: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    'to-read': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status as keyof typeof statusColors] || statusColors['to-read']}`}>
          {book.status}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">by {book.author}</p>
      
      {book.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {book.notes}
        </p>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        Added {book.createdAt?.toLocaleDateString()}
      </div>
    </div>
  );
}
