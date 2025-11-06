# Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for your Bookshelf application.

**✅ Everything in this guide is FREE** - Google OAuth has generous free quotas that are more than enough for personal/small projects.

## Prerequisites

- A Google Cloud account (free)
- Access to your Neon Postgres database (free tier available)
- Environment variables configured

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required information (app name, support email, etc.)
   - Add your email to test users
   - Save and continue through the scopes (default is fine)
6. Create the OAuth client:
   - Application type: **Web application**
   - Name: Bookshelf
   - Authorized JavaScript origins:
     - For local: `http://localhost:3000`
     - For production: `https://bookshelf.bashdemy.com`
   - Authorized redirect URIs:
     - For local: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://bookshelf.bashdemy.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Update Database Schema

Run the migration to update the users table:

```bash
npm run migrate
```

This will add:
- `email` (unique)
- `google_id` (unique)
- `avatar_url`
- Indexes for faster lookups

## Step 3: Set Environment Variables

### Local Development (.env.local)

Create or update `.env.local`:

```env
# Database
DATABASE_URL=your_neon_database_url

# NextAuth
AUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Generate AUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### Production (Cloudflare Workers)

Set these as secrets in Wrangler:

```bash
wrangler secret put AUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put DATABASE_URL
```

And set `NEXTAUTH_URL` in `wrangler.toml`:

```toml
[vars]
NEXTAUTH_URL = "https://bookshelf.bashdemy.com"
```

## Step 4: Test Locally

1. Start the development server:

```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be redirected to the onboarding page
6. Fill in your username and display name
7. You'll be redirected to the home page with your own data

## Step 5: Deploy to Production

1. Make sure all environment variables are set in Cloudflare Workers
2. Update Google OAuth redirect URIs to include your production domain
3. Deploy:

```bash
npm run deploy
```

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After authorization, Google redirects back to `/api/auth/callback/google`
4. NextAuth creates/updates user in database
5. User is redirected to home page

### Onboarding Flow

1. New users are automatically redirected to `/onboarding` after first login
2. User sets username and display name
3. After completion, redirected to home page
4. User can now add/edit their reading items

### Data Access

- **Unauthenticated users**: See `bashdemy` user's data (read-only)
- **Authenticated users**: See their own data (can add/edit)

### Protected Routes

- `/add` - Requires authentication and completed onboarding
- API routes check authentication before allowing writes

## Troubleshooting

### "Invalid credentials" error

- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify redirect URIs match exactly in Google Console

### "AUTH_SECRET is missing"

- Make sure `AUTH_SECRET` is set in your environment variables
- Regenerate if needed

### Database errors

- Run migration: `npm run migrate`
- Check `DATABASE_URL` is correct
- Verify database connection

### Redirect loop

- Check `NEXTAUTH_URL` matches your current domain
- Verify callback URL in Google Console matches exactly

## Cost & Quotas

### Google OAuth (FREE)
- **Free tier**: 100 requests per 100 seconds per user
- **Daily limit**: Effectively unlimited for normal usage
- **Cost**: $0 for reasonable usage (personal projects are well within limits)
- You'll only hit limits if you have thousands of concurrent users

### NextAuth.js (FREE)
- Open source, completely free
- No usage limits

### Database (Neon Postgres)
- Free tier: 0.5 GB storage, 1 project
- More than enough for personal use

**Bottom line**: This entire authentication setup costs **$0** for personal projects and small applications.

## Security Notes

- Never commit `.env.local` to git
- Use strong, random `AUTH_SECRET`
- Keep `GOOGLE_CLIENT_SECRET` secure
- Use HTTPS in production
- Regularly rotate secrets

