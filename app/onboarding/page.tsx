'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(session?.user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      // Update session and force a full page reload to ensure middleware sees the updated user
      await update();
      router.refresh();
      // Use window.location for a full reload to ensure middleware re-runs
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUsername = (username: string) => {
    return /^[a-z0-9_-]{3,20}$/.test(username);
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-divider)', background: 'var(--color-paper)', padding: '2rem' }}>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
          Welcome to Bookshelf! 📚
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-foreground-secondary)' }}>
          Let's set up your profile to get started
        </p>

        {error && (
          <div className="mb-6 rounded-lg border p-4" style={{ borderColor: 'var(--color-error)', background: 'rgba(208, 74, 90, 0.1)' }}>
            <p style={{ color: 'var(--color-error)' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              pattern="[a-z0-9_-]{3,20}"
              className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground)',
                '--tw-ring-color': 'var(--color-primary)',
              } as React.CSSProperties}
              placeholder="johndoe"
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
              3-20 characters, lowercase letters, numbers, hyphens, and underscores only
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
              Display Name *
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground)',
                '--tw-ring-color': 'var(--color-primary)',
              } as React.CSSProperties}
              placeholder="John Doe"
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
              This is how your name will appear to others
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValidUsername(username) || !displayName.trim()}
            className="w-full px-6 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ 
              borderRadius: 'var(--radius-base)',
              background: 'var(--color-primary)',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            {isSubmitting ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </main>
  );
}

