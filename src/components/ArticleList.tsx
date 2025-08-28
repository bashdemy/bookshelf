import { getArticles } from '@/lib/articles';
import ArticleCard from './ArticleCard';
import type { Article } from '@/types/article';
import { FileText } from 'lucide-react';

export default async function ArticleList() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-cute-gradient rounded-3xl border-2 border-secondary/20">
          <FileText className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-cute text-lg">
            No articles yet. Add your first adorable article! 📄✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: Article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
