export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 dark:text-gray-400 sm:px-6 lg:px-8">
        <p>
          Bookshelf by{' '}
          <a
            href="https://bashdemy.com"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            bashdemy
          </a>
        </p>
        <p className="mt-2">Sign in to edit your reading list</p>
      </div>
    </footer>
  );
}

