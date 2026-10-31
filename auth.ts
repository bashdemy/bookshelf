import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from './lib/db';
import { verifyPassword } from './lib/password';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      displayName?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    displayName?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: '/api/auth',
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const usernameInput = String(credentials.username).trim().toLowerCase();
        const passwordInput = String(credentials.password);

        try {
          const result = (await sql`
            SELECT id, username, display_name, password_hash
            FROM users
            WHERE LOWER(username) = ${usernameInput}
            LIMIT 1
          `) as Array<{
            id: string;
            username: string | null;
            display_name: string;
            password_hash: string | null;
          }>;

          const user = result[0];
          if (!user || !user.password_hash) {
            console.warn(`[auth] User "${usernameInput}" not found or missing password.`);
            return null;
          }

          const isValid = await verifyPassword(passwordInput, user.password_hash);
          if (!isValid) {
            console.warn(`[auth] Invalid password attempt for "${usernameInput}".`);
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            name: user.display_name,
            email: null,
            image: null,
          };
        } catch (error) {
          console.error('Error in authorize credentials:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
        token.displayName = user.displayName;
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
