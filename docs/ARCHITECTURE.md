# Bookshelf Architecture Documentation

## Overview

Bookshelf is a reading tracking application that allows users to track books and articles they've read. The application supports both authenticated and unauthenticated modes, with the root user (bashdemy) being publicly viewable.

## Project Structure

```
bookshelf/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata and global structure
│   ├── page.tsx           # Home page with navigation cards
│   ├── books/             # Books page
│   │   └── page.tsx       # Books listing page
│   ├── articles/          # Articles page
│   │   └── page.tsx       # Articles listing page
│   ├── stats/             # Statistics page
│   │   └── page.tsx       # Statistics and analytics page
│   └── globals.css        # Global styles and animations
├── components/            # React components
│   ├── Header.tsx         # Application header with navigation and sign-in
│   ├── Navigation.tsx     # Navigation menu component
│   ├── AuthPrompt.tsx     # Floating authentication prompt
│   ├── Footer.tsx         # Application footer
│   ├── StatsCard.tsx      # Individual statistic card component
│   ├── StatsSection.tsx   # Statistics dashboard section
│   ├── ReadingItemCard.tsx # Card component for displaying books/articles
│   └── ReadingSection.tsx  # Section component for displaying lists of items
├── lib/                   # Core library functions
│   ├── db.ts              # Database connection (Neon Postgres)
│   └── reading-items.ts   # Data access layer for reading items
├── scripts/               # Utility scripts
│   └── migrate.ts         # Database migration and seeding script
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core type definitions
├── utils/                 # Utility functions
│   ├── statistics.ts      # Statistical calculations
│   └── date.ts            # Date formatting utilities
└── docs/                  # Documentation
    └── ARCHITECTURE.md    # This file
```

## Core Types

### ReadingItem

Represents a book or article that has been read.

- `id`: Unique identifier
- `type`: Either 'book' or 'article'
- `title`: Title of the reading item
- `author`: Author name (optional)
- `publication`: Publication name for articles (optional)
- `year`: Publication year (optional)
- `pages`: Number of pages for books (optional)
- `readDate`: ISO date string when the item was read
- `rating`: Rating from 1-5 stars (optional)
- `genre`: Genre classification (optional)
- `tags`: Array of tags for categorization (optional)
- `description`: Additional description (optional)

### User

Represents a user of the application.

- `id`: Unique identifier
- `username`: Username for authentication
- `displayName`: Display name shown in UI
- `isRoot`: Whether this is the root/public user

## Component Architecture

### Page Components

**Home Page (`app/page.tsx`)**
- Landing page with navigation cards
- Displays overview statistics and quick links to books, articles, and stats
- Shows summary of total items and pages read

**Books Page (`app/books/page.tsx`)**
- Displays all books in a grid layout
- Uses ReadingSection component for consistent presentation

**Articles Page (`app/articles/page.tsx`)**
- Displays all articles in a grid layout
- Uses ReadingSection component for consistent presentation

**Stats Page (`app/stats/page.tsx`)**
- Statistics and analytics dashboard
- Displays comprehensive reading statistics using StatsSection component

### Layout Components

**Root Layout (`app/layout.tsx`)**
- Global layout wrapper with Header and Footer
- Applies consistent background gradient and styling
- Manages flex layout to keep footer at bottom

**Header (`components/Header.tsx`)**
- Application header with branding and navigation
- Sign-in button (placeholder for future authentication)
- Conditionally renders AuthPrompt when unauthenticated

**Navigation (`components/Navigation.tsx`)**
- Client-side navigation menu
- Highlights active route
- Responsive navigation links

**AuthPrompt (`components/AuthPrompt.tsx`)**
- Floating cloud-style authentication prompt
- Displays when user is not authenticated
- Fixed position in bottom-left corner with floating animation

**Footer (`components/Footer.tsx`)**
- Application footer with attribution
- Copyright notice with dynamic year
- Links to bashdemy.com

### Display Components

**StatsSection (`components/StatsSection.tsx`)**
- Aggregates and displays reading statistics
- Shows total books, articles, pages, and average rating
- Uses StatsCard components for individual metrics

**StatsCard (`components/StatsCard.tsx`)**
- Reusable card component for displaying a single statistic
- Displays title, value, and optional subtitle

**ReadingSection (`components/ReadingSection.tsx`)**
- Displays a list of reading items (books or articles)
- Shows section title and item count
- Renders ReadingItemCard components in a grid

**ReadingItemCard (`components/ReadingItemCard.tsx`)**
- Displays individual book or article information
- Shows type badge, rating stars, metadata, and tags
- Formats dates and handles optional fields gracefully

## Utility Functions

### Statistics (`utils/statistics.ts`)

- `calculateTotalPages(books)`: Sums total pages from an array of books
- `calculateAverageRating(items)`: Calculates average rating from items with ratings
- `formatItemCount(count, singular, plural)`: Formats count with proper singular/plural form

### Date (`utils/date.ts`)

- `formatReadDate(dateString)`: Formats ISO date string to readable format (e.g., "January 15, 2024")

## Data Layer

### Database Schema

The application uses Neon Postgres with the following schema:

**users**
- `id` (TEXT PRIMARY KEY): Unique user identifier
- `username` (TEXT UNIQUE): Username for authentication
- `display_name` (TEXT): Display name shown in UI
- `is_root` (BOOLEAN): Whether this is the root/public user
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**reading_items**
- `id` (TEXT PRIMARY KEY): Unique reading item identifier
- `user_id` (TEXT): Foreign key to users table
- `type` (TEXT): Either 'book' or 'article'
- `title` (TEXT): Title of the reading item
- `author` (TEXT): Author name (optional)
- `publication` (TEXT): Publication name for articles (optional)
- `year` (INTEGER): Publication year (optional)
- `pages` (INTEGER): Number of pages for books (optional)
- `read_date` (DATE): Date when the item was read
- `rating` (INTEGER): Rating from 1-5 stars (optional)
- `genre` (TEXT): Genre classification (optional)
- `description` (TEXT): Additional description (optional)
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**reading_item_tags**
- `id` (SERIAL PRIMARY KEY): Unique tag identifier
- `reading_item_id` (TEXT): Foreign key to reading_items table
- `tag` (TEXT): Tag name
- Unique constraint on (reading_item_id, tag)

### Database Connection

**lib/db.ts**
- Exports `sql` function from `@neondatabase/serverless`
- Uses `DATABASE_URL` environment variable
- Throws error if `DATABASE_URL` is not set

### Data Access Layer

**lib/reading-items.ts**
- `getReadingItemsByUser(userId)`: Fetches all reading items for a user, including tags
- `getBooksByUser(userId)`: Fetches only books for a user
- `getArticlesByUser(userId)`: Fetches only articles for a user
- `getReadingItemStats(userId)`: Returns aggregated statistics (book count, article count, total pages)

### Migration Script

**scripts/migrate.ts**
- Creates database schema (users, reading_items, reading_item_tags tables)
- Seeds root user (bashdemy) with `is_root = true`
- Populates reading items from initial data
- Can be run with `npm run migrate`

## Authentication Flow

### Current State
- Unauthenticated mode: Shows root user (bashdemy) data
- Sign-in button is a placeholder (no functionality yet)

### Future Implementation
- Google OAuth integration
- Session management
- User-specific data storage
- Edit permissions based on authentication state

## Feature Roadmap

### Phase 1 (Current)
- ✅ Display root user reading list
- ✅ Statistics dashboard
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Database integration with Neon Postgres
- ✅ Data migration and seeding

### Phase 2 (Planned)
- [ ] Google authentication
- [ ] User-specific data storage
- [ ] Manual book/article entry
- [ ] Edit functionality for authenticated users

### Phase 3 (Planned)
- [ ] AI-powered book/article discovery
- [ ] Advanced dashboard with charts and visualizations
- [ ] Genre analysis and favorite genres
- [ ] Custom feeds and following other users

## Design Principles

1. **Clean Code**: Small, focused functions with single responsibilities
2. **Type Safety**: Full TypeScript coverage with proper type definitions
3. **Component Reusability**: Components are modular and reusable
4. **Separation of Concerns**: Clear separation between UI, logic, and data
5. **Accessibility**: Semantic HTML and proper ARIA labels where needed
6. **Responsive Design**: Mobile-first approach with Tailwind CSS

## Styling

- Uses Tailwind CSS v4 for styling
- Dusty pink color palette throughout
- Responsive breakpoints: mobile (default), sm, md, lg
- Material Design principles with elevation system
- Custom animations for floating elements
- Consistent pink gradient backgrounds

## Development Guidelines

1. **Function Naming**: Use descriptive, action-oriented names
2. **Component Size**: Keep components small and focused
3. **Type Safety**: Always define proper TypeScript types
4. **Comments**: Only add comments for complex business logic, not obvious code
5. **Documentation**: Keep architecture documentation up to date
6. **Testing**: Write tests for utility functions and complex logic (future)

