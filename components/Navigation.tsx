'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  href: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/articles', label: 'Articles' },
  { href: '/stats', label: 'Stats' },
  { href: '/add', label: 'Add' },
];

function getNavLinkClassName(isActive: boolean): string {
  const baseClasses = 'px-4 py-2 text-sm font-medium transition-colors';
  const activeClasses = '';
  const inactiveClasses = '';
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
}

function getNavLinkStyle(isActive: boolean): React.CSSProperties {
  return {
    borderRadius: 'var(--radius-base)',
    color: isActive ? 'var(--color-primary)' : 'var(--color-foreground-secondary)',
    backgroundColor: isActive ? 'var(--color-accent-blush)' : 'transparent',
  };
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={getNavLinkClassName(isActive)}
            style={getNavLinkStyle(isActive)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

