import type { Book } from '@/types/book';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const statusConfig = {
    reading: {
      variant: 'default' as const,
      label: 'Reading',
    },
    completed: {
      variant: 'secondary' as const,
      label: 'Completed',
    },
    'to-read': {
      variant: 'outline' as const,
      label: 'To Read',
    },
  };

  const config =
    statusConfig[book.status as keyof typeof statusConfig] ||
    statusConfig['to-read'];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </CardTitle>
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          by {book.author}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {book.notes && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {book.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Added {book.createdAt?.toLocaleDateString()}</span>
          {book.rating && (
            <div className="flex items-center gap-1">
              <span>★</span>
              <span>{book.rating}/5</span>
            </div>
          )}
        </div>

        {(book.pages || book.genre) && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {book.pages && <span>{book.pages} pages</span>}
              {book.genre && <span>{book.genre}</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
