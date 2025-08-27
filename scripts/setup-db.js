const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create the database directory if it doesn't exist
const dbDir = path.join(__dirname, '..');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create or connect to the database
const db = new Database(path.join(dbDir, 'bookshelf.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT DEFAULT 'to-read' NOT NULL,
    notes TEXT,
    rating INTEGER,
    pages INTEGER,
    genre TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT,
    author TEXT,
    publication TEXT,
    summary TEXT,
    notes TEXT,
    tags TEXT,
    status TEXT DEFAULT 'to-read' NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
  );
`);

console.log('Database setup completed successfully!');
db.close();
