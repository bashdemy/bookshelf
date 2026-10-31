'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t py-6" style={{ borderColor: 'var(--color-divider)', background: 'var(--paper)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row" style={{ color: 'var(--color-foreground-secondary)' }}>
          <p className="flex items-center gap-1.5 font-medium">
            <span>🌸 Bookshelf</span>
            <span>•</span>
            <span>Personal Reading Archive</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://bashdemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:underline"
              style={{ color: 'var(--color-foreground)' }}
            >
              bashdemy.com
            </a>
            <span>© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
