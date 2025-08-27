import type { Article } from '@/types/article';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const statusConfig = {
    reading: {
      variant: 'default' as const,
      label: 'Reading'
    },
    completed: {
      variant: 'secondary' as const,
      label: 'Completed'
    },
    'to-read': {
      variant: 'outline' as const,
      label: 'To Read'
    },
  };

  const config = statusConfig[article.status as keyof typeof statusConfig] || statusConfig['to-read'];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {article.author && <span>by {article.author}</span>}
          {article.publication && (
            <>
              <span>•</span>
              <span>{article.publication}</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {article.summary && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.summary}
            </p>
          </div>
        )}
        
        {article.notes && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-3">
              {article.notes}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Added {article.createdAt?.toLocaleDateString()}</span>
          {article.url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                Read
              </a>
            </Button>
          )}
        </div>
        
        {article.tags && (
          <>
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-1">
              {article.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
