# Bookshelf

A personal reading tracking application to track books and articles you've read. View your reading statistics, discover new content, and share your reading journey.

## Features

- 📚 Track books and articles you've read
- 📊 View reading statistics and analytics
- 🌐 Public view mode for the root user (bashdemy)
- 🔐 Authentication system (coming soon)
- 🤖 AI-powered book/article discovery (free via Cloudflare Workers AI)
- 📈 Advanced dashboard with charts and visualizations (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon Postgres account (free tier works)
- Git (for cloning/deploying)

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd bookshelf

# Install dependencies
npm install
```

### Step 2: Set Up Development Database

1. **Create a development database in Neon:**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project (or use existing)
   - Create a branch/database for development (e.g., `bookshelf-dev`)
   - Copy the connection string

2. **Create `.env.local` file:**
   
   In the project root, create a file named `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   ```
   
   - Replace the connection string with your development database connection string from Neon
   - **Note:** AI-powered suggestions use Cloudflare Workers AI (free, built-in). They work automatically when deployed, or use `npm run preview` for local testing with AI.

### Step 3: Run Database Migration

This will create all tables and seed initial data:

```bash
npm run migrate
```

You should see:
```
Creating database schema...
Schema created successfully
Seeding root user...
Root user seeded successfully
Seeding reading items...
Reading items seeded successfully
Migration completed successfully
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will now fetch data from your development database. You can modify data locally without affecting production.

### Step 5: Verify Local Setup

Visit these pages to confirm everything works:
- [http://localhost:3000](http://localhost:3000) - Home page with stats
- [http://localhost:3000/books](http://localhost:3000/books) - Books list
- [http://localhost:3000/articles](http://localhost:3000/articles) - Articles list
- [http://localhost:3000/stats](http://localhost:3000/stats) - Statistics dashboard

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon Postgres (serverless)
- **Deployment**: Cloudflare Workers
- **AI**: Cloudflare Workers AI (Llama 3.1 8B - free, built-in)
- **Fonts**: Geist Sans & Geist Mono

## Production Deployment

This guide covers deploying the current database integration to production.

### Prerequisites for Deployment

- Cloudflare account with Workers enabled
- Neon Postgres production database
- Cloudflare API token and Account ID (for GitHub Actions)
- Wrangler CLI installed (`npm install -g wrangler` or use `npx wrangler`)

### Step 1: Set Up Production Database

1. **Create production database in Neon:**
   - Go to your Neon dashboard
   - Create a new database/branch for production (e.g., `bookshelf-prod`)
   - Copy the production connection string

2. **Create database schema in production:**
   
   **Important:** This will create tables only (no data seeding). Make sure you're using the production connection string.
   
   **On Windows (Git Bash/PowerShell):**
   ```bash
   DATABASE_URL="your_production_connection_string" npm run migrate:schema
   ```
   
   **On Windows (CMD):**
   ```cmd
   set DATABASE_URL=your_production_connection_string
   npm run migrate:schema
   ```
   
   **On Mac/Linux:**
   ```bash
   DATABASE_URL="your_production_connection_string" npm run migrate:schema
   ```
   
   This creates:
   - Database tables (users, reading_items, reading_item_tags)
   - Root user (bashdemy) with is_root = true
   - No reading items (you'll add those manually)
   
   You can then populate reading items manually through the Neon dashboard or SQL queries.
   
   **Note:** If you want to seed initial data, use `npm run migrate` instead of `npm run migrate:schema`.

### Step 2: Configure Cloudflare Workers Secrets

Set the production database URL as a secret in Cloudflare Workers:

```bash
npx wrangler secret put DATABASE_URL
```

When prompted:
- Enter your production database connection string for `DATABASE_URL`
- Press Enter

Verify the secret was set:
```bash
npx wrangler secret list
```

You should see `DATABASE_URL` in the list.

**Note:** AI-powered suggestions use Cloudflare Workers AI which is free and built-in. No API keys needed!

### Step 3: Deploy to Cloudflare Workers

**Option A: Manual Deployment**

```bash
npm run deploy
```

This will:
1. Build the Next.js app for Cloudflare
2. Deploy to Cloudflare Workers
3. Make your app available at `bookshelf.bashdemy.com` (if domain is configured)

**Option B: Automatic Deployment via GitHub Actions**

1. **Set up GitHub Secrets:**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   
   To get these:
   - API Token: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Account ID: Cloudflare Dashboard → Right sidebar under "Account ID"

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add database integration"
   git push origin main
   ```
   
   GitHub Actions will automatically:
   - Build the application
   - Deploy to Cloudflare Workers
   - Use the `DATABASE_URL` secret you set in Step 2

### Step 4: Verify Production Deployment

1. **Check deployment status:**
   ```bash
   npx wrangler deployments list
   ```

2. **View logs:**
   ```bash
   npx wrangler tail bookshelf
   ```

3. **Test the production site:**
   - Visit `bookshelf.bashdemy.com` (or your Cloudflare Workers URL)
   - Verify pages load correctly
   - Check that data is displayed from production database

### Important Notes

- **Database Separation:**
  - `.env.local` = Development database (for local work)
  - Cloudflare Workers secret = Production database (for deployed app)
  - Always run migrations against the correct database

- **Migrations:**
  - Migrations are **manual** - they don't run automatically on deploy
  - Run `npm run migrate` with production `DATABASE_URL` when you need to update schema
  - The migration script is idempotent (safe to run multiple times)

- **Local vs Production:**
  - Local development uses `.env.local` → development database
  - Production uses Cloudflare Workers secret → production database
  - They are completely separate - changes in one don't affect the other

### Troubleshooting

**Migration fails:**
- Verify your connection string is correct
- Check that your Neon database is accessible
- Ensure you're using the right database (dev vs prod)

**Deployment fails:**
- Verify `DATABASE_URL` secret is set in Cloudflare Workers
- Check Cloudflare Workers logs: `npx wrangler tail bookshelf`
- Ensure your API token has Workers permissions

**App works locally but not in production:**
- Verify production database migration completed successfully
- Check that `DATABASE_URL` secret is set correctly
- Review Cloudflare Workers logs for errors

## License

This is an open-source personal project.
