import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddBookForm from '@/components/AddBookForm';
import AddArticleForm from '@/components/AddArticleForm';
import { BookOpen, FileText } from 'lucide-react';

export default function AddItemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Item</h1>
        <p className="text-muted-foreground">
          Add a new book or article to your collection.
        </p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Book
          </TabsTrigger>
          <TabsTrigger value="article" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Article
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <Card>
            <CardHeader>
              <CardTitle>Add New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <AddBookForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Add New Article</CardTitle>
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
