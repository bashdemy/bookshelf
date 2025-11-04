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
];

function getNavLinkClassName(isActive: boolean): string {
  const baseClasses = 'rounded-lg px-4 py-2 text-sm font-medium transition-colors';
  const activeClasses = 'bg-pink-200 text-pink-800';
  const inactiveClasses = 'text-pink-600 hover:bg-pink-100 hover:text-pink-700';
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
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
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

