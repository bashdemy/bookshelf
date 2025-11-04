# Bookshelf Architecture Documentation

## Overview

Bookshelf is a reading tracking application that allows users to track books and articles they've read. The application supports both authenticated and unauthenticated modes, with the root user (bashdemy) being publicly viewable.

## Project Structure

```
bookshelf/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page (landing page)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Application header with sign-in button
│   ├── Footer.tsx         # Application footer
│   ├── StatsCard.tsx      # Individual statistic card component
│   ├── StatsSection.tsx   # Statistics dashboard section
│   ├── ReadingItemCard.tsx # Card component for displaying books/articles
│   └── ReadingSection.tsx  # Section component for displaying lists of items
├── data/                  # Mock data and data sources
│   └── bashdemy.ts        # Root user (bashdemy) reading data
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
- Main landing page component
- Displays root user's reading list in unauthenticated mode
- Orchestrates header, stats, and reading sections

### Layout Components

**Header (`components/Header.tsx`)**
- Application header with branding
- Sign-in button (currently placeholder)
- Displays current user context

**Footer (`components/Footer.tsx`)**
- Application footer with attribution
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

Currently uses mock data in `data/bashdemy.ts` for the root user. This will be replaced with a database connection in future iterations.

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

- Uses Tailwind CSS for styling
- Supports dark mode via system preference
- Responsive breakpoints: mobile (default), sm, md, lg
- Consistent color scheme with gray/blue palette

## Development Guidelines

1. **Function Naming**: Use descriptive, action-oriented names
2. **Component Size**: Keep components small and focused
3. **Type Safety**: Always define proper TypeScript types
4. **Comments**: Only add comments for complex business logic, not obvious code
5. **Documentation**: Keep architecture documentation up to date
6. **Testing**: Write tests for utility functions and complex logic (future)

