# bookshelf

Bookshelf is a lightweight, serverless reading tracker built with Next.js on Cloudflare Pages. It lets me catalog and share what I'm reading on bookshelf.bashdemy.com.

## Architecture

- **Frontend**: Next.js 14 with App Router
- **Deployment**: Cloudflare Pages (static + server routes as Pages Functions/Workers at the edge)
- **Database**: Cloudflare D1 (SQLite) - free tier DB perfect for a solo bookshelf
- **Authentication**: Public read access, admin writes protected with a single admin key

## Features

- 📚 Catalog books with metadata (title, author, status, notes)
- 🌐 Public reading list sharing
- ⚡ Edge computing with Cloudflare Pages Functions
- 💾 SQLite database with D1 for data persistence
- 🔐 Simple admin key protection for writes

## Setup

### Prerequisites

- Node.js 18+ 
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd bookshelf
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your admin key
   ```

3. **Create D1 database:**
   ```bash
   # Create D1 database
   wrangler d1 create bookshelf-db
   
   # Update wrangler.toml with the database ID
   ```

4. **Run database migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

### Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

3. **Set up custom domain:**
   - Configure your domain in Cloudflare Pages
   - Update `wrangler.toml` with your domain

## Environment Variables

```env
# Cloudflare D1 Database
DATABASE_URL="file:./dev.db"

# Admin key for write operations
ADMIN_KEY="your-secret-admin-key"
```

## Database Schema

The app uses Cloudflare D1 (SQLite) with a simple schema for books:

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT DEFAULT 'reading',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── AddBookForm.tsx
│   ├── BookCard.tsx
│   └── BookList.tsx
├── db/                 # Database layer
│   ├── index.ts        # Database connection
│   └── schema.ts       # Drizzle schema
└── lib/                # Utility functions
    └── books.ts        # Book operations
```

## License

MIT 
