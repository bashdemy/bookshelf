import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock data for development
const mockArticles = [
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'The Future of Web Development',
    url: 'https://example.com/future-web-dev',
    author: 'Jane Smith',
    publication: 'Tech Blog',
    summary: 'An overview of emerging trends in web development',
    notes: 'Interesting insights about React Server Components',
    status: 'completed',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Understanding TypeScript Generics',
    url: 'https://example.com/typescript-generics',
    author: 'John Doe',
    publication: 'Programming Weekly',
    summary: 'Deep dive into TypeScript generic types',
    notes: 'Great examples, need to practice more',
    status: 'reading',
    created_at: '2024-01-20T00:00:00.000Z',
    updated_at: '2024-01-20T00:00:00.000Z',
  },
];

export async function getArticles() {
  try {
    // Check if db is a mock database
    if (!db.select || typeof db.select !== 'function') {
      console.log('Using mock data for articles');
      return mockArticles;
    }

    const result = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.created_at));
    return result;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return mockArticles;
  }
}

export async function addArticle(articleData: {
  title: string;
  url: string; // URL is now required
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  status?: string;
  word_count?: number;
  reading_time_minutes?: number;
  source?: string;
  category?: string;
  importance_level?: number;
  is_bookmarked?: boolean;
  is_shared?: boolean;
  share_date?: string;
  start_date?: string;
  finish_date?: string;
}) {
  try {
    const now = new Date().toISOString();

    const result = await db.insert(articles).values({
      id: generateUUID(),
      ...articleData,
      is_bookmarked: articleData.is_bookmarked ? 1 : 0,
      is_shared: articleData.is_shared ? 1 : 0,
      created_at: now,
      updated_at: now,
      created_by: 'system',
      updated_by: 'system',
    });
    return result;
  } catch (error) {
    console.error('Error adding article:', error);
    // Return mock success for development
    return { success: true };
  }
}

export async function updateArticle(
  id: string,
  articleData: Partial<typeof articles.$inferInsert>
) {
  try {
    const now = new Date().toISOString();

    const result = await db
      .update(articles)
      .set({
        ...articleData,
        updated_at: now,
        updated_by: 'system',
      })
      .where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: true };
  }
}

export async function deleteArticle(id: string) {
  try {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: true };
  }
}
