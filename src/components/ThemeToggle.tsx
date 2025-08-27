'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 text-primary transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        
        {/* Moon Icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 text-primary transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </button>
  );
}
