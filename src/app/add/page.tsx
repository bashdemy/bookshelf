import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddBookForm from '@/components/AddBookForm';
import AddArticleForm from '@/components/AddArticleForm';
import { BookOpen, FileText } from 'lucide-react';

export default function AddItemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-cute mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ✨ Add New Item
        </h1>
        <p className="text-lg text-muted-foreground font-cute">
          Add a new book or article to your adorable collection! 📚
        </p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted p-1">
          <TabsTrigger
            value="book"
            className="flex items-center gap-2 rounded-xl font-cute"
          >
            <BookOpen className="w-4 h-4" />
            Book
          </TabsTrigger>
          <TabsTrigger
            value="article"
            className="flex items-center gap-2 rounded-xl font-cute"
          >
            <FileText className="w-4 h-4" />
            Article
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <Card className="card-cute bg-cute-gradient">
            <CardHeader>
              <CardTitle className="font-cute text-2xl flex items-center gap-2">
                <BookOpen className="text-primary" />
                Add New Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddBookForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="article">
          <Card className="card-cute bg-cute-gradient">
            <CardHeader>
              <CardTitle className="font-cute text-2xl flex items-center gap-2">
                <FileText className="text-secondary" />
                Add New Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddArticleForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
