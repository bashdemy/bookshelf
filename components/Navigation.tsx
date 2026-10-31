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
    <nav className="flex items-center gap-1 rounded-full p-1 border border-pink-200/80" style={{ background: '#FCE7F3' }}>
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
                style={{ color: '#9D174D' }}
              >
                {item.label}
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs group-hover:block"
                  style={{
                    background: '#831843',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(131, 24, 67, 0.2)',
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
            className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
            style={{
              background: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#BE185D' : '#9D174D',
              fontWeight: isActive ? 700 : 500,
              boxShadow: isActive ? '0 1px 3px rgba(190, 24, 93, 0.18)' : 'none',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
