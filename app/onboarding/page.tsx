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
      <div className="whimsical-card w-full p-8 sm:p-9">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2 shadow-2xs">
          <span>✦ Profile Setup ✦</span>
        </div>
        <h1 className="mb-1 text-2xl font-bold font-serif tracking-tight text-pink-950">
          Reader Profile Setup
        </h1>
        <p className="mb-6 text-xs font-sans text-pink-700/80">
          Choose your reader handle and public bookshelf display name
        </p>

        {error && (
          <div
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 p-2.5 text-xs font-sans text-rose-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
              Reader Handle *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              pattern="[a-z0-9_-]{3,20}"
              className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="e.g., maria"
            />
            <p className="mt-1 text-[11px] font-sans text-pink-500">
              3–20 characters: lowercase letters, numbers, hyphens, underscores
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
              Display Name *
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="e.g., Maria K."
            />
            <p className="mt-1 text-[11px] font-sans text-pink-500">
              How your name will appear on your bookshelf
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValidUsername(username) || !displayName.trim()}
            className="whimsical-btn-primary w-full text-xs py-2.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}
