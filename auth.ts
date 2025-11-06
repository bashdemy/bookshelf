import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { sql } from './lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      displayName?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, username, display_name, email, google_id, is_root
      FROM users
      WHERE email = ${email}
      LIMIT 1
    ` as Array<{
      id: string;
      username: string | null;
      display_name: string;
      email: string | null;
      google_id: string | null;
      is_root: boolean;
    }>;

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function createUser(email: string, name: string | null, googleId: string, image: string | null) {
  try {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    await sql`
      INSERT INTO users (id, email, display_name, google_id, username, avatar_url)
      VALUES (${id}, ${email}, ${name || username}, ${googleId}, ${username}, ${image})
      ON CONFLICT (email) DO UPDATE SET
        google_id = ${googleId},
        avatar_url = ${image},
        updated_at = NOW()
      RETURNING id, username, display_name, email
    `;

    const result = await sql`
      SELECT id, username, display_name, email, google_id, is_root
      FROM users
      WHERE email = ${email}
      LIMIT 1
    ` as Array<{
      id: string;
      username: string | null;
      display_name: string;
      email: string | null;
      google_id: string | null;
      is_root: boolean;
    }>;

    return result[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: '/api/auth',
  pages: {
    ...authConfig.pages,
    signIn: '/',
  },
  callbacks: {
    ...authConfig.callbacks,
    async redirect({ url, baseUrl }) {
      // baseUrl is automatically detected by NextAuth with trustHost: true
      // It uses the request URL, which works for both local dev and Cloudflare Workers
      // The middleware will handle onboarding redirects, so we just return the requested URL
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token;
        
        if (account.provider === 'google') {
          const email = user.email || profile?.email || '';
          const name = user.name || profile?.name || null;
          const googleId = account.providerAccountId;
          const image = user.image || profile?.picture || null;

          let dbUser = await getUserByEmail(email);

          if (!dbUser) {
            dbUser = await createUser(email, name, googleId, image);
          } else if (!dbUser.google_id) {
            await sql`
              UPDATE users
              SET google_id = ${googleId}, avatar_url = ${image}, updated_at = NOW()
              WHERE email = ${email}
            `;
            dbUser = await getUserByEmail(email);
          }

          if (dbUser) {
            token.sub = dbUser.id;
            token.email = dbUser.email;
            token.username = dbUser.username;
            token.displayName = dbUser.display_name;
            // Store onboarding status in token
            token.isOnboarded = !!(dbUser.username && dbUser.display_name);
          }
        }
      } else if (token.sub) {
        // Refresh user data from database on subsequent requests
        // This ensures onboarding status is up-to-date
        try {
          const result = await sql`
            SELECT username, display_name
            FROM users
            WHERE id = ${token.sub}
            LIMIT 1
          ` as Array<{
            username: string | null;
            display_name: string;
          }>;

          if (result[0]) {
            token.username = result[0].username;
            token.displayName = result[0].display_name;
            token.isOnboarded = !!(result[0].username && result[0].display_name);
          }
        } catch (error) {
          console.error('Error refreshing user data in JWT:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.username = token.username as string | null;
        session.user.displayName = token.displayName as string | null;
      }
      return session;
    },
  },
});

