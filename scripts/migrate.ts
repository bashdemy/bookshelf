import { sql } from '../lib/db';
import { ReadingItem } from '../types';

const bashdemyBooks: ReadingItem[] = [
  {
    id: '1',
    type: 'book',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    pages: 464,
    readDate: '2024-01-15',
    rating: 5,
    genre: 'Programming',
    tags: ['software-engineering', 'best-practices'],
    description: 'A handbook of agile software craftsmanship.',
  },
  {
    id: '2',
    type: 'book',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    year: 1999,
    pages: 352,
    readDate: '2024-02-20',
    rating: 5,
    genre: 'Programming',
    tags: ['software-engineering', 'career'],
  },
  {
    id: '3',
    type: 'book',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2017,
    pages: 616,
    readDate: '2024-03-10',
    rating: 5,
    genre: 'Programming',
    tags: ['databases', 'distributed-systems'],
  },
];

const bashdemyArticles: ReadingItem[] = [
  {
    id: 'a1',
    type: 'article',
    title: 'Understanding React Server Components',
    author: 'Dan Abramov',
    publication: 'React Blog',
    year: 2023,
    readDate: '2024-04-05',
    rating: 5,
    tags: ['react', 'web-development'],
  },
  {
    id: 'a2',
    type: 'article',
    title: 'The Future of Web Development',
    author: 'Various',
    publication: 'TechCrunch',
    year: 2024,
    readDate: '2024-04-12',
    rating: 4,
    tags: ['web-development', 'trends'],
  },
];

async function createSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      is_root BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reading_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('book', 'article')),
      title TEXT NOT NULL,
      author TEXT,
      publication TEXT,
      year INTEGER,
      pages INTEGER,
      read_date DATE NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      genre TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reading_item_tags (
      id SERIAL PRIMARY KEY,
      reading_item_id TEXT NOT NULL REFERENCES reading_items(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      UNIQUE(reading_item_id, tag)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reading_items_user_id ON reading_items(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reading_items_type ON reading_items(type)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reading_item_tags_item_id ON reading_item_tags(reading_item_id)
  `;
}

async function seedRootUser() {
  const rootUser = {
    id: 'bashdemy',
    username: 'bashdemy',
    displayName: 'bashdemy',
    isRoot: true,
  };

  await sql`
    INSERT INTO users (id, username, display_name, is_root)
    VALUES (${rootUser.id}, ${rootUser.username}, ${rootUser.displayName}, ${rootUser.isRoot})
    ON CONFLICT (id) DO NOTHING
  `;
}

async function seedReadingItems() {
  const rootUserId = 'bashdemy';

  for (const item of [...bashdemyBooks, ...bashdemyArticles]) {
    await sql`
      INSERT INTO reading_items (
        id, user_id, type, title, author, publication, year, pages,
        read_date, rating, genre, description
      )
      VALUES (
        ${item.id},
        ${rootUserId},
        ${item.type},
        ${item.title},
        ${item.author || null},
        ${item.publication || null},
        ${item.year || null},
        ${item.pages || null},
        ${item.readDate},
        ${item.rating || null},
        ${item.genre || null},
        ${item.description || null}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    if (item.tags && item.tags.length > 0) {
      for (const tag of item.tags) {
        await sql`
          INSERT INTO reading_item_tags (reading_item_id, tag)
          VALUES (${item.id}, ${tag})
          ON CONFLICT (reading_item_id, tag) DO NOTHING
        `;
      }
    }
  }
}

async function migrateSchemaOnly() {
  try {
    console.log('Creating database schema...');
    await createSchema();
    console.log('Schema created successfully');

    console.log('Creating root user (bashdemy)...');
    await seedRootUser();
    console.log('Root user created successfully');

    console.log('Migration completed successfully (schema only - no reading items seeded)');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function migrate() {
  try {
    console.log('Creating database schema...');
    await createSchema();
    console.log('Schema created successfully');

    console.log('Seeding root user...');
    await seedRootUser();
    console.log('Root user seeded successfully');

    console.log('Seeding reading items...');
    await seedReadingItems();
    console.log('Reading items seeded successfully');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--schema-only')) {
    migrateSchemaOnly();
  } else {
    migrate();
  }
}

