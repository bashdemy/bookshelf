# Bookshelf

Bookshelf is a lightweight, serverless reading tracker built with Next.js 15 on Cloudflare Pages. It lets you catalog and track both books and articles, with a beautiful interface for managing your reading collection.

## What This App Does

Bookshelf is a personal reading management system that helps you:

- **📚 Track Books**: Add books with metadata including title, author, status, rating, pages, genre, and notes
- **📄 Manage Articles**: Save articles with URLs, publications, summaries, tags, and reading status
- **📊 View Analytics**: See reading statistics, progress tracking, and genre breakdowns
- **🌐 Share Publicly**: Your reading list is publicly accessible for sharing with others
- **🎨 Modern UI**: Clean, responsive interface with dark/light theme support
- **🌸 Cute Theme**: Adorable pastel aesthetic with playful animations and rounded design

## Key Features

### Book Management

- Add books with comprehensive metadata (title, author, status, rating, pages, genre, notes)
- Track reading status: "to-read", "reading", "completed"
- Rate books on a 5-star scale
- Organize by genre
- Add personal notes and thoughts

### Article Management

- Save articles with URLs and publication information
- Add summaries and personal notes
- Tag articles for better organization
- Track reading status similar to books

### Analytics Dashboard

- Overview statistics for books and articles
- Reading progress tracking
- Genre analysis for books
- Recent additions tracking
- Status distribution charts

### User Experience

- Responsive design that works on desktop and mobile
- Dark/light theme toggle
- Clean, intuitive navigation
- Fast loading with edge computing
- Cute pastel theme with playful animations

## Cute Theme Features

The app features a delightful "girly pop" aesthetic with:

### Color Palette

- **Primary**: Dusty pink (HSL: 340 60% 75%)
- **Secondary**: Lavender (HSL: 270 50% 85%)
- **Accent**: Peach (HSL: 25 80% 85%)
- **Background**: Soft cream (HSL: 45 100% 98%)

### Design Elements

- **Rounded Corners**: Pill-like buttons and cards with 2xl+ border radius
- **Soft Shadows**: Custom shadow-cute and shadow-soft for depth
- **Playful Animations**: Gentle hover effects, scale transforms, and floating animations
- **Typography**: Quicksand font for headings and UI elements
- **Gradients**: Pink-to-peach gradient backgrounds and text effects

### Component Variants

- **Cute Buttons**: `variant="cute"`, `variant="cute-secondary"`, `variant="cute-outline"`
- **Cute Sizes**: `size="cute-sm"`, `size="cute-lg"`, `size="cute-icon"`
- **Utility Classes**: `.btn-cute`, `.card-cute`, `.input-cute`, `.badge-cute`
- **Gradient Backgrounds**: `.bg-cute-gradient` for soft pastel backgrounds

### Demo

Visit `/demo` to see the cute theme in action with interactive examples!

## Architecture

- **Frontend**: Next.js 15 with App Router and TypeScript
- **UI Components**: Radix UI primitives with Tailwind CSS styling
- **Deployment**: Cloudflare Pages (static + server routes as Pages Functions/Workers at the edge)
- **Database**: Cloudflare D1 (SQLite) - serverless database perfect for personal use
- **Authentication**: Public read access, admin writes protected with a single admin key
- **ORM**: Drizzle ORM for type-safe database operations
- **Package Manager**: pnpm for faster, more efficient dependency management

## How It Works

### Database Schema

The app uses two main tables:

**Books Table:**

- `id`: Unique identifier
- `title`: Book title
- `author`: Author name
- `status`: Reading status (to-read, reading, completed)
- `rating`: 1-5 star rating
- `pages`: Number of pages
- `genre`: Book genre
- `notes`: Personal notes
- `createdAt`/`updatedAt`: Timestamps

**Articles Table:**

- `id`: Unique identifier
- `title`: Article title
- `url`: Article URL
- `author`: Article author
- `publication`: Publication name
- `summary`: Article summary
- `notes`: Personal notes
- `tags`: Comma-separated tags
- `status`: Reading status
- `createdAt`/`updatedAt`: Timestamps

### Application Flow

1. **Home Page**: Redirects to `/books` by default
2. **Navigation**: Four main sections - Books, Articles, Data, Add Item
3. **Adding Content**: Forms for adding books and articles with validation
4. **Viewing Content**: Lists with filtering and status indicators
5. **Analytics**: Dashboard showing reading statistics and progress

### Security Model

- **Read Access**: Public - anyone can view your reading list
- **Write Access**: Protected by admin key - only you can add/edit items
- **No User Accounts**: Simple key-based authentication for simplicity

## Setup

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)
- pnpm (recommended) or npm

### Local Development

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd bookshelf
   pnpm install
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
   pnpm run db:generate
   pnpm run db:migrate
   ```

5. **Start development server:**
   ```bash
   pnpm run dev
   ```

### Deployment

1. **Build the project:**

   ```bash
   pnpm run build
   ```

2. **Deploy to Cloudflare Pages:**

   ```bash
   pnpm run deploy
   ```

3. **Set up custom domain:**
   - Configure your domain in Cloudflare Pages
   - Update `wrangler.toml` with your domain

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin key for write operations
ADMIN_KEY="your-secret-admin-key"

# Cloudflare D1 (for production)
# These will be set in wrangler.toml
# DB_BINDING="DB"
# DATABASE_ID="your-database-id"
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Deploy to Cloudflare Pages
pnpm run deploy

# Database operations
pnpm run db:generate  # Generate migrations
pnpm run db:migrate   # Run migrations
pnpm run db:studio    # Open Drizzle Studio

# Type checking
pnpm run type-check   # Run TypeScript type checking

# Linting
pnpm run lint         # Run ESLint

# Code formatting
pnpm run format       # Format code with Prettier
pnpm run format:check # Check code formatting

# Run all checks
pnpm run check-all    # Run type-check, lint, and format-check
```

## Pre-commit Hooks

This project uses Husky and lint-staged to ensure code quality on every commit. The pre-commit hook automatically:

- **Formats code** with Prettier
- **Lints TypeScript/Next.js** code with ESLint
- **Runs TypeScript type checking** to catch type errors
- **Applies fixes** automatically when possible

### Setup

The pre-commit hooks are automatically configured when you run `pnpm install` (via the `prepare` script). The configuration includes:

- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files only
- **Prettier**: Code formatting
- **ESLint**: Code linting with Next.js and TypeScript rules

### Configuration Files

- **`.husky/pre-commit`**: Pre-commit hook script
- **`.prettierrc`**: Prettier configuration
- **`.prettierignore`**: Files to exclude from formatting
- **`package.json`**: lint-staged configuration

### Manual Usage

You can run the same checks manually:

```bash
# Format all code
pnpm run format

# Check formatting without changing files
pnpm run format:check

# Run all quality checks
pnpm run check-all
```

## Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── api/            # API routes for books and articles
│   │   ├── books/      # Book API endpoints
│   │   └── articles/   # Article API endpoints
│   ├── books/          # Books page
│   ├── articles/       # Articles page
│   ├── data/           # Analytics dashboard
│   ├── add/            # Add new items page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout with navigation
│   └── page.tsx        # Home page (redirects to books)
├── components/         # React components
│   ├── ui/             # Reusable UI components (Radix UI)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── AddBookForm.tsx # Book addition form
│   ├── AddArticleForm.tsx # Article addition form
│   ├── BookCard.tsx    # Individual book display
│   ├── BookList.tsx    # Books listing
│   ├── ArticleCard.tsx # Individual article display
│   ├── ArticleList.tsx # Articles listing
│   ├── Navigation.tsx  # Main navigation
│   ├── ThemeProvider.tsx # Theme context
│   └── ThemeToggle.tsx # Theme toggle button
├── db/                 # Database layer
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Drizzle schema definitions
│   └── production.ts   # Production database config
├── lib/                # Utility functions
│   ├── books.ts        # Book operations
│   ├── articles.ts     # Article operations
│   └── utils.ts        # General utilities
└── types/              # TypeScript type definitions
    ├── book.ts         # Book types
    └── article.ts      # Article types
```

## Configuration Files

- **`next.config.js`**: Next.js configuration with Cloudflare Pages optimizations
- **`.eslintrc.json`**: ESLint configuration with TypeScript support
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`tsconfig.json`**: TypeScript configuration
- **`wrangler.toml`**: Cloudflare Workers/Wrangler configuration
- **`drizzle.config.ts`**: Drizzle ORM configuration

## Usage

### Adding Books

1. Navigate to the Books page or Add Item page
2. Fill out the book form with title, author, and optional metadata
3. Set the reading status (to-read, reading, completed)
4. Add a rating, genre, or notes if desired
5. Submit to add to your collection

### Adding Articles

1. Navigate to the Articles page or Add Item page
2. Fill out the article form with title, URL, and optional metadata
3. Add publication info, summary, or tags
4. Set the reading status
5. Submit to add to your collection

### Viewing Analytics

1. Navigate to the Data page
2. View overview statistics
3. Explore book and article-specific analytics
4. Track your reading progress and habits

### Managing Your Collection

- Update status as you progress through books/articles
- Add ratings and notes as you complete items
- Use the search and filtering to find specific items
- Share your public reading list URL with others

## Recent Updates

### Next.js 15 Upgrade

- Upgraded from Next.js 14 to Next.js 15.5.2
- Updated React to version 19.1.1
- Updated TypeScript types for React 19
- Fixed ESLint configuration for better TypeScript support
- Updated Next.js configuration for compatibility

### Code Quality Improvements

- Fixed unused variable warnings in API routes
- Improved error handling in form components
- Enhanced TypeScript type safety
- Updated ESLint rules for better code quality

## License

MIT
