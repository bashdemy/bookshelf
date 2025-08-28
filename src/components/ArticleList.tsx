import { getArticles } from '@/lib/articles';
import ArticleCard from './ArticleCard';
import type { Article } from '@/types/article';

export default async function ArticleList() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles yet. Add your first article!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: Article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
