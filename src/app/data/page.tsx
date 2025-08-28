import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBooks } from '@/lib/books';
import { getArticles } from '@/lib/articles';
import { BarChart3, BookOpen, FileText, TrendingUp } from 'lucide-react';
import type { Book } from '@/types/book';
import type { Article } from '@/types/article';

export default async function DataPage() {
  const books = await getBooks();
  const articles = await getArticles();

  // Calculate statistics
  const bookStats = {
    total: books.length,
    reading: books.filter((b: Book) => b.status === 'reading').length,
    completed: books.filter((b: Book) => b.status === 'completed').length,
    toRead: books.filter((b: Book) => b.status === 'to-read').length,
    averageRating:
      books.filter((b: Book) => b.rating).length > 0
        ? (
            books
              .filter((b: Book) => b.rating)
              .reduce((sum: number, b: Book) => sum + (b.rating || 0), 0) /
            books.filter((b: Book) => b.rating).length
          ).toFixed(1)
        : 'N/A',
  };

  const articleStats = {
    total: articles.length,
    reading: articles.filter((a: Article) => a.status === 'reading').length,
    completed: articles.filter((a: Article) => a.status === 'completed').length,
    toRead: articles.filter((a: Article) => a.status === 'to-read').length,
  };

  // Calculate top genres
  const genreCounts = books
    .filter((b: Book) => b.genre)
    .reduce(
      (acc: Record<string, number>, book: Book) => {
        acc[book.genre!] = (acc[book.genre!] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data & Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your reading habits and track your progress.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Books
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {bookStats.completed} completed, {bookStats.reading} reading
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Articles
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{articleStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {articleStats.completed} completed, {articleStats.reading}{' '}
                  reading
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookStats.total + articleStats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined books and articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Book Rating
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookStats.averageRating}
                </div>
                <p className="text-xs text-muted-foreground">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Book Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>To Read</span>
                    <span className="font-bold">{bookStats.toRead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading</span>
                    <span className="font-bold">{bookStats.reading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-bold">{bookStats.completed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {books
                    .slice(-5)
                    .reverse()
                    .map((book: Book) => (
                      <div
                        key={book.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm truncate">{book.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {book.status}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topGenres.length > 0 ? (
                    topGenres.map(([genre, count]) => (
                      <div key={genre} className="flex justify-between">
                        <span className="text-sm">{genre}</span>
                        <span className="font-bold">{count as number}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No genres added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Article Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>To Read</span>
                    <span className="font-bold">{articleStats.toRead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading</span>
                    <span className="font-bold">{articleStats.reading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-bold">{articleStats.completed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {articles
                    .slice(-5)
                    .reverse()
                    .map((article: Article) => (
                      <div
                        key={article.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm truncate">
                          {article.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.status}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
