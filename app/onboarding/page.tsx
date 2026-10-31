'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (!displayName && (session.user.displayName || session.user.name)) {
        setDisplayName(session.user.displayName || session.user.name || '');
      }
      if (!username) {
        if (session.user.username) {
          setUsername(session.user.username);
        } else if (session.user.email) {
          const suggested = session.user.email
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '')
            .slice(0, 20);
          if (suggested.length >= 3) {
            setUsername(suggested);
          }
        }
      }
    }
  }, [session, displayName, username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to complete profile');
      }

      await update();
      router.refresh();
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUsername = (u: string) => {
    return /^[a-z0-9_-]{3,20}$/.test(u);
  };

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="w-full p-7"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          background: 'var(--paper)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h1 className="mb-1 text-2xl font-bold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
          Profile Setup
        </h1>
        <p className="mb-6 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
          Choose your reader handle and public display name
        </p>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              pattern="[a-z0-9_-]{3,20}"
              className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="e.g., maria"
            />
            <p className="mt-1 text-[11px]" style={{ color: 'var(--color-foreground-secondary)' }}>
              3–20 characters: lowercase letters, numbers, hyphens, underscores
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Display Name *
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="e.g., Maria K."
            />
            <p className="mt-1 text-[11px]" style={{ color: 'var(--color-foreground-secondary)' }}>
              How your name will appear on your bookshelf
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValidUsername(username) || !displayName.trim()}
            className="w-full rounded-md py-2.5 text-xs font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
            style={{ 
              background: 'var(--color-primary)',
              boxShadow: 'var(--shadow-button-primary)',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}
