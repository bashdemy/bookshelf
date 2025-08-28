import type { Book } from '@/types/book';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Star, Calendar, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const statusConfig = {
    reading: {
      variant: 'default' as const,
      label: 'Reading',
      color: 'text-secondary',
    },
    completed: {
      variant: 'secondary' as const,
      label: 'Completed',
      color: 'text-accent',
    },
    'to-read': {
      variant: 'outline' as const,
      label: 'To Read',
      color: 'text-primary',
    },
    abandoned: {
      variant: 'destructive' as const,
      label: 'Abandoned',
      color: 'text-destructive',
    },
  };

  const config =
    statusConfig[book.status as keyof typeof statusConfig] ||
    statusConfig['to-read'];

  return (
    <Card className="card-cute group hover:shadow-cute-hover transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors font-cute">
            {book.title}
          </CardTitle>
          <Badge
            variant={config.variant}
            className={`badge-cute font-cute ${config.color}`}
          >
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-medium font-cute flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          by {book.author}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {book.notes && (
          <div className="mb-4 p-3 bg-primary/10 rounded-2xl border-2 border-primary/20">
            <p className="text-sm text-muted-foreground line-clamp-3 font-cute">
              {book.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground font-cute">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Added{' '}
            {book.created_at
              ? new Date(book.created_at).toLocaleDateString()
              : 'Unknown'}
          </span>
          {book.rating && (
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-3 h-3 fill-current" />
              <span>{book.rating}/5</span>
            </div>
          )}
        </div>

        {(book.pages || book.genre) && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-cute">
              {book.pages && (
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {book.pages} pages
                </span>
              )}
              {book.genre && (
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {book.genre}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
