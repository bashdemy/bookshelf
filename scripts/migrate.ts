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
    id: 'art-toy-software-barretto',
    type: 'article',
    title: 'Writing Toy Software Is A Joy',
    author: 'Joshua Barretto',
    publication: 'jsbarretto.com',
    url: 'https://jsbarretto.com/posts/writing-toy-software-is-a-joy/',
    year: 2025,
    pages: 8,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-08-11',
    description: 'Purely parking this here so Future Me can come back and build some of these. The list is great, equal parts useful, unhinged, and I definitely don’t have time for this.',
    tags: ['Programming', 'Hacking', 'Toy Projects', 'Creativity'],
  },
  {
    id: 'art-vibe-code-maccaw',
    type: 'article',
    title: 'How to Vibe Code as a Senior Engineer',
    author: 'Alex MacCaw',
    publication: 'blog.alexmaccaw.com',
    url: 'https://blog.alexmaccaw.com/how-to-vibe-code-as-a-senior-engineer/',
    year: 2025,
    pages: 12,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-08-11',
    description: 'I think this is a good starting point except perhaps the CLI tool diagnosis (I still quite enjoy Claude Code, thank you very much). But the broader point? Completely agree. The real draw for me is not just the speed. It is that the barrier to trying weird, possibly ridiculous ideas has never been lower. You can throw something together, see if it sticks, and move on without the week-long build and polish cycle.',
    tags: ['AI', 'Engineering', 'Vibe Coding', 'Software Architecture'],
  },
  {
    id: 'art-llm-lang-design-gopinathan',
    type: 'article',
    title: 'How LLMs Reshape Language Design',
    author: 'Kiran Gopinathan',
    publication: 'kirancodes.me',
    url: 'https://kirancodes.me/posts/log-lang-design-llms.html',
    year: 2025,
    pages: 14,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-18',
    description: 'The LLM wave seems to flatten the programming landscape: Python everywhere, the rest demoted to curiosities (I am still thinking of the horseless carriage analogy months later), at what point do we discard and declare something an archaism?',
    tags: ['Compilers', 'Language Design', 'LLMs', 'Programming Languages'],
  },
  {
    id: 'art-horseless-carriages-koomen',
    type: 'article',
    title: 'Horseless Carriages',
    author: 'Koomen',
    publication: 'koomen.dev',
    url: 'https://koomen.dev/essays/horseless-carriages/',
    year: 2025,
    pages: 10,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-18',
    description: 'On technological transitions and paradigm shifts: how early automobiles were shaped like horse-drawn carriages before cars discovered their native affordances, and what that means for AI-native software engineering.',
    tags: ['Technology & Society', 'Essays', 'AI Paradigms', 'History of Tech'],
  },
  {
    id: 'art-coding-agents-chasm-singleton',
    type: 'article',
    title: 'Coding Agents Cross a Chasm',
    author: 'Brad Singleton',
    publication: 'blog.singleton.io',
    url: 'https://blog.singleton.io/posts/2025-06-14-coding-agents-cross-a-chasm',
    year: 2025,
    pages: 16,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-03',
    description: 'Everyone’s asking if AI will replace programmers. We should be asking what can we build now. I relate to this; my work relationship with AI has developed the same way over the last few years.',
    tags: ['AI Agents', 'Coding', 'Software Engineering', 'Future of Work'],
  },
  {
    id: 'art-ai-charging-rent-hunter',
    type: 'article',
    title: 'AI is Charging Rent. Must Be Sydney: On the Creeping SaaS-ification of Software Engineering',
    author: 'Rian Hunter',
    publication: 'rianhunter.com',
    url: 'https://rianhunter.com',
    year: 2025,
    pages: 9,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-01',
    description: 'On the creeping SaaS-ification of software engineering, recurring developer tolls, and how developer tools are morphing into high-rent landlords.',
    tags: ['SaaS', 'Developer Tools', 'Industry Commentary', 'Sydney Tech'],
  },
  {
    id: 'a1',
    type: 'article',
    title: 'Understanding React Server Components',
    author: 'Dan Abramov',
    publication: 'React Blog',
    year: 2023,
    pages: 8,
    genre: 'Technology & Code',
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
    pages: 6,
    genre: 'Technology & Code',
    readDate: '2024-04-12',
    rating: 4,
    tags: ['web-development', 'trends'],
  },
];

async function createSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      display_name TEXT NOT NULL,
      email TEXT UNIQUE,
      google_id TEXT UNIQUE,
      avatar_url TEXT,
      is_root BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const existingColumns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND table_schema = 'public'
  ` as Array<{ column_name: string }>;

  const columnNames = existingColumns.map(c => c.column_name);

  if (!columnNames.includes('email')) {
    await sql`ALTER TABLE users ADD COLUMN email TEXT`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email) WHERE email IS NOT NULL`;
  }

  if (!columnNames.includes('google_id')) {
    await sql`ALTER TABLE users ADD COLUMN google_id TEXT`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique ON users(google_id) WHERE google_id IS NOT NULL`;
  }

  if (!columnNames.includes('avatar_url')) {
    await sql`ALTER TABLE users ADD COLUMN avatar_url TEXT`;
  }

  if (!columnNames.includes('password_hash')) {
    await sql`ALTER TABLE users ADD COLUMN password_hash TEXT`;
  }

  if (columnNames.includes('username')) {
    try {
      const constraints = await sql`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'users' 
        AND constraint_type = 'NOT NULL'
        AND constraint_name LIKE '%username%'
      ` as Array<{ constraint_name: string }>;
      
      if (constraints.length === 0) {
        await sql`ALTER TABLE users ALTER COLUMN username DROP NOT NULL`;
      }
    } catch (error) {
      console.log('Note: Could not modify username constraint (may already be nullable)');
    }
  }

  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL
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
      url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE reading_items ADD COLUMN IF NOT EXISTS url TEXT
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
    CREATE INDEX IF NOT EXISTS idx_reading_items_user_type_date ON reading_items(user_id, type, read_date DESC)
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
        read_date, rating, genre, description, url
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
        ${item.description || null},
        ${item.url || null}
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

