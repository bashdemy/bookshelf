import ArticleList from '@/components/ArticleList';
import AddArticleForm from '@/components/AddArticleForm';

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-cute mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          📄 My Articles
        </h1>
        <p className="text-lg text-muted-foreground font-cute">
          Save and organize articles you want to read or have already read! 📖
        </p>
      </div>

      <div className="space-y-8">
        <AddArticleForm />
        <ArticleList />
      </div>
    </div>
  );
}
