'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
          borderColor: 'var(--color-divider)',
          background: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 1px 2px rgba(26, 23, 20, 0.03)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-85"
                style={{ color: 'var(--color-foreground)' }}
              >
                <span className="text-xl">🌸</span>
                <span>Bookshelf</span>
              </Link>
              <Navigation />
            </div>

            {status === 'loading' ? (
              <div className="px-4 py-2 text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                Loading...
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    title="View your public bookshelf"
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-[#F2EDE4]"
                    style={{
                      border: '1px solid var(--color-divider)',
                      background: 'var(--paper)',
                    }}
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        {(session.user?.displayName || session.user?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F2EDE4]"
                  style={{
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-foreground-secondary)',
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-5 py-2 text-xs font-bold transition-all active:translate-y-[1px]"
                style={{
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: 'var(--shadow-button-primary)',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      {!isAuthenticated && status !== 'loading' && <AuthPrompt />}
    </>
  );
}
