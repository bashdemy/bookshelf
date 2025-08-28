import type { Article } from '@/types/article';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, User, Calendar } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
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
    archived: {
      variant: 'destructive' as const,
      label: 'Archived',
      color: 'text-destructive',
    },
  };

  const config =
    statusConfig[article.status as keyof typeof statusConfig] ||
    statusConfig['to-read'];

  return (
    <Card className="card-cute group hover:shadow-cute-hover transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-secondary transition-colors font-cute">
            {article.title}
          </CardTitle>
          <Badge
            variant={config.variant}
            className={`badge-cute font-cute ${config.color}`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-cute">
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-secondary" />
              by {article.author}
            </span>
          )}
          {article.publication && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-secondary" />
                {article.publication}
              </span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {article.summary && (
          <div className="mb-4 p-3 bg-secondary/10 rounded-2xl border-2 border-secondary/20">
            <p className="text-sm text-muted-foreground line-clamp-3 font-cute">
              {article.summary}
            </p>
          </div>
        )}

        {article.notes && (
          <div className="mb-4 p-3 bg-accent/10 rounded-2xl border-2 border-accent/20">
            <p className="text-sm text-accent-foreground line-clamp-3 font-cute">
              {article.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground font-cute">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Added{' '}
            {article.created_at
              ? new Date(article.created_at).toLocaleDateString()
              : 'Unknown'}
          </span>
          {article.url && (
            <Button variant="cute-outline" size="cute-sm" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                Read
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
