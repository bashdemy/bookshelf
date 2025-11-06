'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t backdrop-blur-md py-4" style={{ borderColor: 'var(--color-divider)', background: 'var(--color-paper)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-end gap-1 text-right">
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            Built by{' '}
            <a
              href="https://bashdemy.com"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-secondary)', textDecorationColor: 'rgba(122, 92, 158, 0.35)' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = 'rgba(122, 92, 158, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'rgba(122, 92, 158, 0.35)'}
              target="_blank"
              rel="noopener noreferrer"
            >
              bashdemy
            </a>
            {' '}❤️
          </p>
          <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
            © {currentYear} Bookshelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

