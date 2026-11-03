'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { IconLogout, IconLogin, IconSparkles } from '@tabler/icons-react';
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
        className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{
          borderColor: 'rgba(244, 114, 182, 0.22)',
          background: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 4px 20px -4px rgba(236, 72, 153, 0.08)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 sm:gap-10">
              <Link
                href="/"
                className="group flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 text-white shadow-xs shadow-pink-500/30">
                  <IconSparkles size={16} className="animate-spin-slow" />
                </span>
                <span className="font-serif text-2xl font-bold tracking-tight text-pink-950 group-hover:text-pink-600 transition-colors">
                  Bookshelf
                </span>
                <span className="text-xs text-pink-400 font-serif select-none hidden sm:inline">✦</span>
              </Link>
              <Navigation />
            </div>

            {status === 'loading' ? (
              <div className="px-4 py-1.5 text-xs font-sans text-pink-400 animate-pulse">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    title="View your public bookshelf"
                    className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 transition-all hover:bg-pink-50 border border-pink-200/80 bg-white/90 shadow-2xs group"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-pink-300"
                      />
                    ) : (
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-rose-400 shadow-xs"
                      >
                        {(session.user?.displayName || session.user?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-sans font-semibold text-pink-900 group-hover:text-pink-600 transition-colors">
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans font-semibold text-pink-900">
                      {session.user?.displayName || session.user?.username || 'User'}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-sans font-medium text-pink-700 bg-white/80 hover:bg-pink-50 border border-pink-200/80 shadow-2xs hover:text-pink-900 transition-all active:translate-y-[1px]"
                >
                  <IconLogout size={13} className="text-pink-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="whimsical-btn-primary text-xs py-2 px-4.5"
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
