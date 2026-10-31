'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Navigation from './Navigation';
import AuthPrompt from './AuthPrompt';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

  async function handleSignInClick() {
    await signIn('google', { callbackUrl: '/' });
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  const profileHref = session?.user?.username ? `/u/${session.user.username}` : undefined;

  return (
    <>
      <header className="sticky top-0 z-10 border-b backdrop-blur-md" style={{ borderColor: 'var(--color-divider)', background: 'var(--color-paper)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-3xl font-bold tracking-tight transition-opacity hover:opacity-90" style={{ color: 'var(--color-primary)' }}>
                🌸 Bookshelf
              </Link>
              <Navigation />
            </div>
            {status === 'loading' ? (
              <div className="px-6 py-3 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                Loading...
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    title="View your public bookshelf"
                    className="flex items-center gap-2.5 px-3 py-1.5 transition-colors hover:opacity-80"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-accent-blush)',
                    }}
                  >
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-accent-plum)' }}>
                      {session.user?.displayName || session.user?.name || 'User'}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2.5">
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-9 w-9 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                      {session.user?.displayName || session.user?.name || 'User'}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-bold transition-colors"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-primary)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-blush)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative overflow-hidden px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98]"
                style={{ 
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-primary)',
                }}
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              </Link>
            )}
          </div>
        </div>
      </header>
      {!isAuthenticated && status !== 'loading' && <AuthPrompt />}
    </>
  );
}
