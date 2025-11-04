export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-pink-200/60 bg-pink-100/90 backdrop-blur-md py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-end gap-1 text-right">
          <p className="text-sm text-pink-600">
            Built by{' '}
            <a
              href="https://bashdemy.com"
              className="font-semibold text-pink-700 transition-colors hover:text-pink-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              bashdemy
            </a>
            {' '}❤️
          </p>
          <p className="text-xs text-pink-500">
            © {currentYear} Bookshelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

