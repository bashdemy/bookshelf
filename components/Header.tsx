'use client';

import Navigation from './Navigation';
import AuthPrompt from './AuthPrompt';

export default function Header() {
  function handleSignInClick() {
    // TODO: Implement Google authentication
  }

  const isAuthenticated = false;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-pink-200/60 bg-pink-100/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-bold tracking-tight text-pink-700">
                🌸 Bookshelf
              </h1>
              <Navigation />
            </div>
            <button
              onClick={handleSignInClick}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-pink-300/30 transition-all hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:shadow-pink-400/40 active:scale-[0.98] active:shadow-md"
            >
              <span className="relative z-10">Sign in with Google</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </button>
          </div>
        </div>
      </header>
      {!isAuthenticated && <AuthPrompt />}
    </>
  );
}

