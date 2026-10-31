# Authentication Setup Guide

Bookshelf uses direct, self-contained **Username & Password Authentication** using standard NextAuth.js and Web Crypto PBKDF2 hashing.

**✅ Completely free, zero third-party keys** — no Google Cloud Console setup, no OAuth client credentials, no redirect URI approvals needed.

---

## How It Works

1. **Sign In & Account Registration**:
   - Access the `/login` page by clicking **"Sign In"** in the header.
   - Choose **"Create Account"** to register a new username, display name, and password.
   - Or choose **"Sign In"** to authenticate with your existing credentials.
2. **Password Security**:
   - Passwords are securely hashed with `PBKDF2-SHA256` (100,000 iterations + unique 16-byte random salt) using the browser and Node/Edge native Web Crypto API.
   - Works seamlessly across local development, Node.js, and Cloudflare Workers.
3. **Session Management**:
   - NextAuth manages encrypted JWT session cookies signed with `AUTH_SECRET`.
   - Authenticated users see their personal bookshelf, can add, edit, and delete their books and articles, and can view their public profile at `/u/[username]`.
   - Unauthenticated visitors view the root `bashdemy` reading list in read-only mode.

---

## Environment Variables

### Local Development (`.env.local`)

```env
DATABASE_URL="your_neon_database_url"
AUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### Production Deployment (Cloudflare Workers)

Set these secrets in Wrangler:

```bash
wrangler secret put AUTH_SECRET
wrangler secret put DATABASE_URL
```

And ensure `NEXTAUTH_URL` is set in `wrangler.toml`:

```toml
[vars]
NEXTAUTH_URL = "https://bookshelf.bashdemy.com"
```
