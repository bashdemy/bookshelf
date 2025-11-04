'use client';

export default function Header() {
  function handleSignInClick() {
    // TODO: Implement Google authentication
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📚 Bookshelf
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reading tracker for bashdemy
            </p>
          </div>
          <button
            onClick={handleSignInClick}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </header>
  );
}

