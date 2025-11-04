export default function Footer() {
  return (
    <footer className="mt-20 border-t border-pink-200/60 bg-pink-100/90 backdrop-blur-md py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-pink-600">
          Bookshelf by{' '}
          <a
            href="https://bashdemy.com"
            className="font-semibold text-pink-700 transition-colors hover:text-pink-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            bashdemy
          </a>
        </p>
        <p className="mt-3 text-xs text-pink-500">Sign in to edit your reading list</p>
      </div>
    </footer>
  );
}

