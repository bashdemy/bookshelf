import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Mock data for development
const mockArticles = [
  {
    id: 1,
    title: "The Future of Web Development",
    url: "https://example.com/future-web-dev",
    author: "Jane Smith",
    publication: "Tech Blog",
    summary: "An overview of emerging trends in web development",
    notes: "Interesting insights about React Server Components",
    tags: "web development, react, javascript",
    status: "completed",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 2,
    title: "Understanding TypeScript Generics",
    url: "https://example.com/typescript-generics",
    author: "John Doe",
    publication: "Programming Weekly",
    summary: "Deep dive into TypeScript generic types",
    notes: "Great examples, need to practice more",
    tags: "typescript, programming, generics",
    status: "reading",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export async function getArticles() {
  try {
    const result = await db.select().from(articles).orderBy(articles.createdAt);
    return result;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return mockArticles;
  }
}

export async function addArticle(articleData: {
  title: string;
  url?: string;
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  tags?: string;
  status?: string;
}) {
  try {
    const now = new Date();
    const result = await db.insert(articles).values({
      ...articleData,
      createdAt: now,
      updatedAt: now,
    });
    return result;
  } catch (error) {
    console.error('Error adding article:', error);
    // Return mock success for development
    return { success: true };
  }
}

export async function updateArticle(id: number, articleData: Partial<typeof articles.$inferInsert>) {
  try {
    const result = await db.update(articles).set({
      ...articleData,
      updatedAt: new Date(),
    }).where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: true };
  }
}

export async function deleteArticle(id: number) {
  try {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: true };
  }
}
