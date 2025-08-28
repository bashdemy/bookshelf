import ArticleList from '@/components/ArticleList';
import AddArticleForm from '@/components/AddArticleForm';

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground">
          Save and organize articles you want to read or have already read.
        </p>
      </div>

      <div className="space-y-8">
        <AddArticleForm />
        <ArticleList />
      </div>
    </div>
  );
}
