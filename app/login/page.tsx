'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanUsername = username.trim().toLowerCase();

    try {
      if (mode === 'register') {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanUsername,
            displayName: displayName.trim() || cleanUsername,
            password,
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || 'Failed to create account');
        }
      }

      const res = await signIn('credentials', {
        username: cleanUsername,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error('Invalid username or password');
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-md p-8"
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-divider)',
        background: 'var(--color-paper)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
          🌸 Bookshelf
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
          {mode === 'signin' ? 'Sign in to your personal library' : 'Create your personal bookshelf account'}
        </p>
      </div>

      <div
        className="mb-6 flex rounded-full p-1"
        style={{ background: 'var(--color-background)', border: '1px solid var(--color-divider)' }}
      >
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
          }}
          className="flex-1 py-1.5 text-xs font-bold transition-all"
          style={{
            borderRadius: 'var(--radius-full)',
            background: mode === 'signin' ? 'var(--color-primary)' : 'transparent',
            color: mode === 'signin' ? 'white' : 'var(--color-foreground-secondary)',
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className="flex-1 py-1.5 text-xs font-bold transition-all"
          style={{
            borderRadius: 'var(--radius-full)',
            background: mode === 'register' ? 'var(--color-primary)' : 'transparent',
            color: mode === 'register' ? 'white' : 'var(--color-foreground-secondary)',
          }}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div
          className="mb-5 rounded-lg border p-3 text-xs"
          style={{
            borderColor: 'var(--color-error)',
            background: 'rgba(208, 74, 90, 0.08)',
            color: 'var(--color-error)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-xs font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            Username *
          </label>
          <input
            id="username"
            type="text"
            required
            autoCapitalize="none"
            autoCorrect="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., maria"
            className="w-full bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-foreground)',
            }}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label
              htmlFor="displayName"
              className="mb-1 block text-xs font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              Display Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Maria K."
              className="w-full bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            Password *
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
            className="w-full bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-foreground)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !username.trim() || !password}
          className="mt-2 w-full px-4 py-3 text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{
            borderRadius: 'var(--radius-base)',
            background: 'var(--gradient-primary)',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          {isSubmitting
            ? mode === 'signin'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'signin'
              ? 'Sign In'
              : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--color-secondary)' }}>
          ← Back to public library
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
