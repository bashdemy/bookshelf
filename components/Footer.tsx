'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t py-8" style={{ borderColor: '#FCE7F3', background: '#FFF7F9' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row text-pink-900/70">
          <p className="flex items-center gap-1.5 font-semibold text-pink-950">
            <span>🌸 Bookshelf</span>
            <span className="text-pink-300">•</span>
            <span className="text-pink-700">Personal Reading Archive</span>
          </p>
          <div className="flex items-center gap-4 text-pink-900/70">
            <a
              href="https://bashdemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-pink-950 transition-all hover:text-pink-600 hover:scale-105"
            >
              <span>built by bashdemy</span>
              <span className="text-sm transition-transform hover:scale-125">🩷</span>
            </a>
            <span className="text-pink-400 font-mono">© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
