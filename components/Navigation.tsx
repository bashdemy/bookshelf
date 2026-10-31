'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface NavigationItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/articles', label: 'Articles' },
  { href: '/stats', label: 'Stats' },
  { href: '/add', label: 'Add', requiresAuth: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <nav className="flex items-center gap-1 rounded-full p-1" style={{ background: '#EFEBE2' }}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = !!(item.requiresAuth && !isAuthenticated);
        const tooltipText = isDisabled
          ? 'Showing public data. Sign in to add your own books.'
          : undefined;

        if (isDisabled) {
          return (
            <div key={item.href} className="group relative inline-block">
              <span
                className="inline-block cursor-not-allowed rounded-full px-3.5 py-1.5 text-xs font-medium opacity-50"
                style={{ color: 'var(--color-foreground-secondary)' }}
              >
                {item.label}
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs group-hover:block"
                  style={{
                    background: '#1D1B18',
                    color: '#FFFFFF',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {tooltipText}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
              fontWeight: isActive ? 600 : 500,
              boxShadow: isActive ? '0 1px 2px rgba(26, 23, 20, 0.08)' : 'none',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
