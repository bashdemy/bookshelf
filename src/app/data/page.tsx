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
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-cute mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
          📊 Reading Analytics
        </h1>
        <p className="text-lg text-muted-foreground font-cute">
          Visualize your reading habits and track your adorable progress! 📈
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted p-1">
          <TabsTrigger value="overview" className="rounded-xl font-cute">
            Overview
          </TabsTrigger>
          <TabsTrigger value="books" className="rounded-xl font-cute">
            Books
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-xl font-cute">
            Articles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-cute bg-cute-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-cute">
                  Total Books
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cute text-primary">
                  {bookStats.total}
                </div>
                <p className="text-xs text-muted-foreground font-cute">
                  {bookStats.completed} completed, {bookStats.reading} reading
                </p>
              </CardContent>
            </Card>

            <Card className="card-cute bg-cute-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-cute">
                  Total Articles
                </CardTitle>
                <FileText className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cute text-secondary">
                  {articleStats.total}
                </div>
                <p className="text-xs text-muted-foreground font-cute">
                  {articleStats.completed} completed, {articleStats.reading}{' '}
                  reading
                </p>
              </CardContent>
            </Card>

            <Card className="card-cute bg-cute-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-cute">
                  Total Items
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cute text-accent">
                  {bookStats.total + articleStats.total}
                </div>
                <p className="text-xs text-muted-foreground font-cute">
                  Combined books and articles
                </p>
              </CardContent>
            </Card>

            <Card className="card-cute bg-cute-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-cute">
                  Avg Book Rating
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cute text-primary">
                  {bookStats.averageRating}
                </div>
                <p className="text-xs text-muted-foreground font-cute">
                  Out of 5 stars
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-cute">
              <CardHeader>
                <CardTitle className="font-cute">
                  Book Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between font-cute">
                    <span>To Read</span>
                    <span className="font-bold text-primary">
                      {bookStats.toRead}
                    </span>
                  </div>
                  <div className="flex justify-between font-cute">
                    <span>Reading</span>
                    <span className="font-bold text-secondary">
                      {bookStats.reading}
                    </span>
                  </div>
                  <div className="flex justify-between font-cute">
                    <span>Completed</span>
                    <span className="font-bold text-accent">
                      {bookStats.completed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-cute">
              <CardHeader>
                <CardTitle className="font-cute">Recent Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {books
                    .slice(-5)
                    .reverse()
                    .map((book: Book) => (
                      <div
                        key={book.id}
                        className="flex justify-between items-center font-cute"
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

            <Card className="card-cute">
              <CardHeader>
                <CardTitle className="font-cute">Top Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topGenres.length > 0 ? (
                    topGenres.map(([genre, count]) => (
                      <div
                        key={genre}
                        className="flex justify-between font-cute"
                      >
                        <span className="text-sm">{genre}</span>
                        <span className="font-bold text-primary">
                          {count as number}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground font-cute">
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
            <Card className="card-cute">
              <CardHeader>
                <CardTitle className="font-cute">
                  Article Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between font-cute">
                    <span>To Read</span>
                    <span className="font-bold text-primary">
                      {articleStats.toRead}
                    </span>
                  </div>
                  <div className="flex justify-between font-cute">
                    <span>Reading</span>
                    <span className="font-bold text-secondary">
                      {articleStats.reading}
                    </span>
                  </div>
                  <div className="flex justify-between font-cute">
                    <span>Completed</span>
                    <span className="font-bold text-accent">
                      {articleStats.completed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-cute">
              <CardHeader>
                <CardTitle className="font-cute">Recent Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {articles
                    .slice(-5)
                    .reverse()
                    .map((article: Article) => (
                      <div
                        key={article.id}
                        className="flex justify-between items-center font-cute"
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
