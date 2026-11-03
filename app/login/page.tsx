'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { IconFlower } from '@tabler/icons-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [mode, setMode] = useState<'signin' | 'register' | 'reset'>('signin');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanUsername = username.trim().toLowerCase();

    try {
      if (mode === 'reset') {
        const resetRes = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanUsername,
            newPassword: password,
          }),
        });

        const resetData = await resetRes.json();
        if (!resetRes.ok) {
          throw new Error(resetData.error || 'Failed to reset password');
        }

        setSuccessMsg('Password updated! Signing you in...');
      } else if (mode === 'register') {
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
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="whimsical-card w-full max-w-sm p-8 sm:p-9">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-2 shadow-2xs">
          <span>✦ Welcome Reader ✦</span>
        </div>
        <h1 className="text-2xl font-bold font-serif tracking-tight text-pink-950">
          Reader Sign In
        </h1>
        <p className="mt-1 text-xs font-sans text-pink-700/80">
          {mode === 'signin'
            ? 'Sign in to log and catalog your own reads'
            : mode === 'register'
            ? 'Create your reader profile'
            : 'Reset access key credentials'}
        </p>
      </div>

      <div className="mb-5 flex rounded-full p-1 bg-pink-100/70 border border-pink-200/80">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-sans font-semibold transition-all ${
            mode === 'signin'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-pink-700 hover:text-pink-950'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-sans font-semibold transition-all ${
            mode === 'register'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-pink-700 hover:text-pink-950'
          }`}
        >
          New User
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('reset');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-sans font-semibold transition-all ${
            mode === 'reset'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-pink-700 hover:text-pink-950'
          }`}
        >
          Reset
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/90 p-2.5 text-xs font-sans text-emerald-800">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 p-2.5 text-xs font-sans text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-xs font-sans font-semibold text-pink-950"
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
            className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label
              htmlFor="displayName"
              className="mb-1.5 block text-xs font-sans font-semibold text-pink-950"
            >
              Display Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Maria"
              className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-sans font-semibold text-pink-950"
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
            className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !username.trim() || !password}
          className="whimsical-btn-primary mt-2 w-full text-xs py-2.5 disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'signin'
              ? 'Authenticating...'
              : mode === 'register'
              ? 'Creating account...'
              : 'Updating key...'
            : mode === 'signin'
              ? 'Sign In'
              : mode === 'register'
              ? 'Create Reader Profile'
              : 'Reset & Sign In'}
        </button>
      </form>

      <div className="mt-5 text-center text-xs">
        <Link href="/" className="font-sans text-pink-700 hover:text-pink-950 transition-colors">
          ← Return to reading nook
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
