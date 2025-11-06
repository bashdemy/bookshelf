import { sql } from './db';
import { ReadingItem } from '@/types';

export async function getReadingItemsByUser(userId: string): Promise<ReadingItem[]> {
  try {
    const items = await sql`
      SELECT 
        ri.id,
        ri.type,
        ri.title,
        ri.author,
        ri.publication,
        ri.year,
        ri.pages,
        ri.read_date as readDate,
        ri.rating,
        ri.genre,
        ri.description,
        COALESCE(
          ARRAY_AGG(rit.tag ORDER BY rit.tag) FILTER (WHERE rit.tag IS NOT NULL),
          ARRAY[]::TEXT[]
        ) as tags
      FROM reading_items ri
      LEFT JOIN reading_item_tags rit ON ri.id = rit.reading_item_id
      WHERE ri.user_id = ${userId}
      GROUP BY ri.id
      ORDER BY ri.read_date DESC
    ` as Array<{
      id: string;
      type: string;
      title: string;
      author: string | null;
      publication: string | null;
      year: number | null;
      pages: number | null;
      readdate?: string;
      read_date?: string;
      readDate?: string;
      rating: number | null;
      genre: string | null;
      description: string | null;
      tags: string[];
    }>;

    return items.map((item) => {
      const readDate = item.readdate || item.read_date || item.readDate;
      if (!readDate) {
        throw new Error(`Missing readDate for item ${item.id}`);
      }
      
      return {
        id: item.id,
        type: item.type as 'book' | 'article',
        title: item.title,
        author: item.author || undefined,
        publication: item.publication || undefined,
        year: item.year || undefined,
        pages: item.pages || undefined,
        readDate,
        rating: item.rating || undefined,
        genre: item.genre || undefined,
        tags: item.tags || undefined,
        description: item.description || undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching reading items:', error);
    return [];
  }
}

export async function getBooksByUser(userId: string): Promise<ReadingItem[]> {
  const items = await getReadingItemsByUser(userId);
  return items.filter((item) => item.type === 'book');
}

export async function getArticlesByUser(userId: string): Promise<ReadingItem[]> {
  const items = await getReadingItemsByUser(userId);
  return items.filter((item) => item.type === 'article');
}

export async function getReadingItemStats(userId: string) {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE type = 'book') as book_count,
        COUNT(*) FILTER (WHERE type = 'article') as article_count,
        COALESCE(SUM(pages) FILTER (WHERE type = 'book'), 0) as total_pages
      FROM reading_items
      WHERE user_id = ${userId}
    ` as Array<{
      book_count: number | string;
      article_count: number | string;
      total_pages: number | string;
    }>;

    return {
      bookCount: Number(stats[0]?.book_count || 0),
      articleCount: Number(stats[0]?.article_count || 0),
      totalPages: Number(stats[0]?.total_pages || 0),
    };
  } catch (error) {
    console.error('Error fetching reading item stats:', error);
    return {
      bookCount: 0,
      articleCount: 0,
      totalPages: 0,
    };
  }
}

