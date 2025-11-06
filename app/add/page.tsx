'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingItem, ReadingItemType } from '@/types';

export const dynamic = 'force-dynamic';

interface FormData {
  type: ReadingItemType;
  title: string;
  author: string;
  publication: string;
  year: string;
  pages: string;
  genre: string;
  tags: string;
  description: string;
  readDate: string;
  rating: string;
}

interface Suggestion {
  type: ReadingItemType;
  title: string;
  author: string;
  publication: string;
}

export default function AddPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleAIProcess = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process description');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setError(data.error || 'No suggestions found. Please try a more detailed description or use manual entry.');
      }
    } catch (err) {
      console.error('AI processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process description';
      setError(errorMessage + '. You can use "Manual Entry" instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setFormData({
      type: suggestion.type,
      title: suggestion.title,
      author: suggestion.author || '',
      publication: suggestion.publication || '',
      year: '',
      pages: '',
      genre: '',
      tags: '',
      description: '',
      readDate: new Date().toISOString().split('T')[0],
      rating: '',
    });
    setSuggestions([]);
  };

  const handleManualEntry = () => {
    setFormData({
      type: 'book',
      title: '',
      author: '',
      publication: '',
      year: '',
      pages: '',
      genre: '',
      tags: '',
      description: '',
      readDate: new Date().toISOString().split('T')[0],
      rating: '',
    });
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const item: Omit<ReadingItem, 'id'> = {
        type: formData.type,
        title: formData.title.trim(),
        author: formData.author.trim() || undefined,
        publication: formData.publication.trim() || undefined,
        year: formData.year ? parseInt(formData.year, 10) : undefined,
        pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
        genre: formData.genre.trim() || undefined,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        description: formData.description.trim() || undefined,
        readDate: formData.readDate,
        rating: formData.rating ? parseInt(formData.rating, 10) : undefined,
      };

      if (!item.title) {
        throw new Error('Title is required');
      }

      const response = await fetch('/api/reading-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save item');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-pink-700">
          Add Reading Item
        </h1>
        <p className="mt-2 text-pink-600">
          Describe what you've read and let AI help fill in the details
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!formData && suggestions.length === 0 ? (
        <div className="rounded-2xl border border-pink-200/70 bg-pink-100/90 p-8">
          <label htmlFor="description" className="block text-sm font-medium text-pink-700 mb-2">
            Describe what you read
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I read Clean Code by Robert C. Martin"
            className="w-full rounded-lg border border-pink-300 bg-white px-4 py-3 text-pink-900 placeholder-pink-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[120px]"
            disabled={isProcessing}
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleManualEntry}
              className="flex-1 rounded-lg border border-pink-300 bg-white px-6 py-3 font-semibold text-pink-700 transition-colors hover:bg-pink-50"
            >
              Manual Entry
            </button>
            <button
              onClick={handleAIProcess}
              disabled={isProcessing || !description.trim()}
              className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? 'Finding suggestions...' : 'Get AI Suggestions'}
            </button>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-pink-200/70 bg-pink-100/90 p-6">
            <h2 className="text-lg font-semibold text-pink-700 mb-4">
              Select a suggestion:
            </h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left rounded-lg border border-pink-300 bg-white p-4 hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">
                          {suggestion.type === 'book' ? '📖' : '✨'}
                        </span>
                        <span className="font-semibold text-pink-900">
                          {suggestion.title}
                        </span>
                      </div>
                      {suggestion.author && (
                        <p className="text-sm text-pink-600">by {suggestion.author}</p>
                      )}
                      {suggestion.publication && (
                        <p className="text-sm text-pink-600">in {suggestion.publication}</p>
                      )}
                    </div>
                    <span className="text-pink-600">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setSuggestions([]);
              setDescription('');
            }}
            className="w-full rounded-lg border border-pink-300 bg-white px-6 py-3 font-semibold text-pink-700 transition-colors hover:bg-pink-50"
          >
            Try Again
          </button>
        </div>
      ) : formData ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-pink-200/70 bg-pink-100/90 p-8 space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-pink-700 mb-2">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ReadingItemType)}
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="book">📖 Book</option>
                <option value="article">✨ Article</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-pink-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {formData.type === 'book' ? (
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-pink-700 mb-2">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="publication" className="block text-sm font-medium text-pink-700 mb-2">
                  Publication
                </label>
                <input
                  id="publication"
                  type="text"
                  value={formData.publication}
                  onChange={(e) => handleInputChange('publication', e.target.value)}
                  className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-pink-700 mb-2">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {formData.type === 'book' && (
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-pink-700 mb-2">
                    Pages
                  </label>
                  <input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-pink-700 mb-2">
                Genre
              </label>
              <input
                id="genre"
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="readDate" className="block text-sm font-medium text-pink-700 mb-2">
                Read Date *
              </label>
              <input
                id="readDate"
                type="date"
                value={formData.readDate}
                onChange={(e) => handleInputChange('readDate', e.target.value)}
                required
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-pink-700 mb-2">
                Rating (1-5)
              </label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-pink-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., programming, best-practices, software-engineering"
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-pink-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full rounded-lg border border-pink-300 bg-white px-4 py-3 text-pink-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData(null);
                setDescription('');
                setError(null);
              }}
              className="flex-1 rounded-lg border border-pink-300 bg-white px-6 py-3 font-semibold text-pink-700 transition-colors hover:bg-pink-50"
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Collection'}
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}

