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

function getNavLinkClassName(isActive: boolean, isDisabled: boolean): string {
  const baseClasses = 'px-4 py-2 text-sm font-medium transition-colors';
  const disabledClasses = 'cursor-not-allowed opacity-50';
  
  return `${baseClasses} ${isDisabled ? disabledClasses : ''}`;
}

function getNavLinkStyle(isActive: boolean, isDisabled: boolean): React.CSSProperties {
  return {
    borderRadius: 'var(--radius-base)',
    color: isDisabled 
      ? 'var(--color-foreground-secondary)' 
      : isActive 
        ? 'var(--color-primary)' 
        : 'var(--color-foreground-secondary)',
    backgroundColor: isActive && !isDisabled ? 'var(--color-accent-blush)' : 'transparent',
  };
}

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <nav className="flex gap-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = !!(item.requiresAuth && !isAuthenticated);
        const tooltipText = isDisabled 
          ? 'Showing data for bashdemy. Login to add your own items.' 
          : undefined;

        if (isDisabled) {
          return (
            <div
              key={item.href}
              className="group relative inline-block"
              title={tooltipText}
            >
              <span
                className={getNavLinkClassName(isActive, isDisabled)}
                style={{
                  ...getNavLinkStyle(isActive, isDisabled),
                  display: 'inline-block',
                }}
              >
                {item.label}
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded px-3 py-1.5 text-xs group-hover:block z-50"
                  style={{
                    background: 'var(--color-foreground)',
                    color: 'var(--color-paper)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {tooltipText}
                  <div
                    className="absolute left-1/2 bottom-full h-2 w-2 -translate-x-1/2 rotate-45"
                    style={{ background: 'var(--color-foreground)' }}
                  />
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={getNavLinkClassName(isActive, isDisabled)}
            style={getNavLinkStyle(isActive, isDisabled)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

