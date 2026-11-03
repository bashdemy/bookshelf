'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { IconFlower, IconLogout, IconLogin, IconUser } from '@tabler/icons-react';
import Navigation from './Navigation';
import AuthPrompt from './AuthPrompt';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  const profileHref = session?.user?.username ? `/u/${session.user.username}` : undefined;

  return (
    <>
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{
          borderColor: 'rgba(184, 138, 62, 0.35)',
          background: 'rgba(255, 250, 245, 0.94)',
          boxShadow: '0 1px 3px rgba(90, 34, 50, 0.05), 0 6px 16px -6px rgba(90, 34, 50, 0.08)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-serif italic tracking-tight text-pink-900 transition-opacity hover:opacity-85"
              >
                <span className="text-gold text-xl">❦</span>
                <span>Bookshelf</span>
              </Link>
              <Navigation />
            </div>

            {status === 'loading' ? (
              <div className="px-4 py-2 text-xs font-serif italic text-pink-800/70">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    title="View your public bookshelf"
                    className="flex items-center gap-2 rounded-sm px-3 py-1.5 transition-colors hover:bg-white border border-gold/40 bg-white/70 shadow-2xs"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-6 w-6 rounded-sm object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-sm text-xs font-serif font-bold text-white bg-pink-700"
                      >
                        {(session.user?.displayName || session.user?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-serif font-semibold text-pink-900">
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-semibold text-pink-900">
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-serif text-pink-900 bg-white/70 hover:bg-white border border-gold/40 shadow-2xs active:translate-y-[1px]"
                >
                  <IconLogout size={13} className="text-gold-dark" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-sm px-4 py-1.5 text-xs font-serif font-semibold text-white bg-pink-700 hover:bg-pink-800 border border-pink-900/40 shadow-xs active:translate-y-[1px]"
              >
                <IconLogin size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      {!isAuthenticated && status !== 'loading' && <AuthPrompt />}
    </>
  );
}
