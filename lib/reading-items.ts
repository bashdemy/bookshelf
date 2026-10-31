import { sql } from './db';
import { ReadingItem } from '@/types';

interface RawReadingItemRow {
  id: string;
  type: string;
  title: string;
  author: string | null;
  publication: string | null;
  year: number | null;
  pages: number | null;
  readdate?: string | Date;
  read_date?: string | Date;
  readDate?: string | Date;
  rating: number | null;
  genre: string | null;
  description: string | null;
  url?: string | null;
  tags: string[];
}

function mapRowToReadingItem(item: RawReadingItemRow): ReadingItem {
  const rawDate = item.readdate || item.read_date || item.readDate;
  if (!rawDate) {
    throw new Error(`Missing readDate for item ${item.id}`);
  }

  const readDate =
    rawDate instanceof Date
      ? rawDate.toISOString().split('T')[0]
      : String(rawDate).split('T')[0];

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
    tags: item.tags && item.tags.length > 0 ? item.tags : undefined,
    description: item.description || undefined,
    url: item.url || undefined,
  };
}

export async function getReadingItemsByUser(userId: string): Promise<ReadingItem[]> {
  try {
    const items = (await sql`
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
        ri.url,
        COALESCE(
          ARRAY_AGG(rit.tag ORDER BY rit.tag) FILTER (WHERE rit.tag IS NOT NULL),
          ARRAY[]::TEXT[]
        ) as tags
      FROM reading_items ri
      LEFT JOIN reading_item_tags rit ON ri.id = rit.reading_item_id
      WHERE ri.user_id = ${userId}
      GROUP BY ri.id
      ORDER BY ri.read_date DESC, ri.created_at DESC
    `) as RawReadingItemRow[];

    return items.map(mapRowToReadingItem);
  } catch (error) {
    console.error('Error fetching reading items:', error);
    return [];
  }
}

export async function getReadingItemById(id: string, userId: string): Promise<ReadingItem | null> {
  try {
    const items = (await sql`
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
        ri.url,
        COALESCE(
          ARRAY_AGG(rit.tag ORDER BY rit.tag) FILTER (WHERE rit.tag IS NOT NULL),
          ARRAY[]::TEXT[]
        ) as tags
      FROM reading_items ri
      LEFT JOIN reading_item_tags rit ON ri.id = rit.reading_item_id
      WHERE ri.id = ${id} AND ri.user_id = ${userId}
      GROUP BY ri.id
      LIMIT 1
    `) as RawReadingItemRow[];

    if (!items[0]) return null;
    return mapRowToReadingItem(items[0]);
  } catch (error) {
    console.error('Error fetching reading item by id:', error);
    return null;
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
    const stats = (await sql`
      SELECT 
        COUNT(*) FILTER (WHERE type = 'book') as book_count,
        COUNT(*) FILTER (WHERE type = 'article') as article_count,
        COALESCE(SUM(pages) FILTER (WHERE type = 'book'), 0) as total_pages
      FROM reading_items
      WHERE user_id = ${userId}
    `) as Array<{
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

export async function createReadingItem(userId: string, item: Omit<ReadingItem, 'id'>): Promise<ReadingItem> {
  try {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    await sql`
      INSERT INTO reading_items (
        id, user_id, type, title, author, publication, year, pages,
        read_date, rating, genre, description, url
      )
      VALUES (
        ${id},
        ${userId},
        ${item.type},
        ${item.title},
        ${item.author || null},
        ${item.publication || null},
        ${item.year || null},
        ${item.pages || null},
        ${item.readDate},
        ${item.rating || null},
        ${item.genre || null},
        ${item.description || null},
        ${item.url || null}
      )
    `;

    if (item.tags && item.tags.length > 0) {
      for (const tag of item.tags) {
        const cleanTag = tag.trim();
        if (cleanTag) {
          await sql`
            INSERT INTO reading_item_tags (reading_item_id, tag)
            VALUES (${id}, ${cleanTag})
            ON CONFLICT (reading_item_id, tag) DO NOTHING
          `;
        }
      }
    }

    return { id, ...item };
  } catch (error) {
    console.error('Error creating reading item:', error);
    throw error;
  }
}

export async function updateReadingItem(
  userId: string,
  id: string,
  item: Omit<ReadingItem, 'id'>
): Promise<ReadingItem | null> {
  try {
    const updated = (await sql`
      UPDATE reading_items
      SET
        type = ${item.type},
        title = ${item.title},
        author = ${item.author || null},
        publication = ${item.publication || null},
        year = ${item.year || null},
        pages = ${item.pages || null},
        read_date = ${item.readDate},
        rating = ${item.rating || null},
        genre = ${item.genre || null},
        description = ${item.description || null},
        url = ${item.url || null},
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `) as Array<{ id: string }>;

    if (!updated[0]) {
      return null;
    }

    await sql`
      DELETE FROM reading_item_tags
      WHERE reading_item_id = ${id}
    `;

    if (item.tags && item.tags.length > 0) {
      for (const tag of item.tags) {
        const cleanTag = tag.trim();
        if (cleanTag) {
          await sql`
            INSERT INTO reading_item_tags (reading_item_id, tag)
            VALUES (${id}, ${cleanTag})
            ON CONFLICT (reading_item_id, tag) DO NOTHING
          `;
        }
      }
    }

    return { id, ...item };
  } catch (error) {
    console.error('Error updating reading item:', error);
    throw error;
  }
}

export async function deleteReadingItem(userId: string, id: string): Promise<boolean> {
  try {
    const deleted = (await sql`
      DELETE FROM reading_items
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `) as Array<{ id: string }>;

    return deleted.length > 0;
  } catch (error) {
    console.error('Error deleting reading item:', error);
    throw error;
  }
}
