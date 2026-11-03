'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconArticle,
  IconArrowRight,
  IconSparkles,
  IconPencil,
  IconStarFilled,
  IconStar,
} from '@tabler/icons-react';
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
  url: string;
  readDate: string;
  rating: string;
}

interface Suggestion {
  type: ReadingItemType;
  title: string;
  author: string;
  publication: string;
  year?: string;
  pages?: string;
  genre?: string;
  tags?: string;
  description?: string;
  url?: string;
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
      setError('Please enter a description or link');
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
      year: suggestion.year || '',
      pages: suggestion.pages || '',
      genre: suggestion.genre || '',
      tags: suggestion.tags || '',
      description: suggestion.description || '',
      url: suggestion.url || '',
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
      url: '',
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
        url: formData.url.trim() || undefined,
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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-pink-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-2 shadow-2xs">
          <IconSparkles size={13} className="text-pink-500" />
          <span>Catalog & Accession</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-pink-950">
          Log a New Book or Article
        </h1>
        <p className="mt-1 text-xs font-sans text-pink-700/80 max-w-2xl">
          Enter details manually or paste an article URL to automatically extract the details.
        </p>
      </div>

      {error && (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-sans text-rose-700 shadow-xs"
        >
          {error}
        </div>
      )}

      {!formData && suggestions.length === 0 ? (
        <div className="whimsical-card p-6 sm:p-8">
          <label htmlFor="description" className="mb-2.5 block text-xs font-sans font-bold uppercase tracking-wider text-pink-900">
            Describe the read or paste an article link
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Designing Data-Intensive Applications by Martin Kleppmann OR paste an article URL..."
            className="min-h-[120px] w-full bg-white/95 p-3.5 text-xs font-sans leading-relaxed rounded-2xl border border-pink-200 text-pink-950 placeholder:text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-xs"
            disabled={isProcessing}
          />
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleManualEntry}
              className="whimsical-btn-secondary flex-1 text-xs py-2.5"
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={handleAIProcess}
              disabled={isProcessing || !description.trim()}
              className="whimsical-btn-primary flex-1 text-xs py-2.5 disabled:opacity-50"
            >
              <IconSparkles size={14} />
              <span>{isProcessing ? 'Looking up...' : 'Auto-Fill Details'}</span>
            </button>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          <div className="whimsical-card p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-sans font-bold uppercase tracking-wider text-pink-900">
              Extracted Suggestion
            </h2>
            <div className="space-y-2.5">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left p-4 rounded-2xl border border-pink-100 bg-white/90 hover:bg-pink-50 hover:border-pink-200 transition-all group shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-pink-500">
                          {suggestion.type === 'book' ? <IconBook size={16} /> : <IconArticle size={16} />}
                        </span>
                        <span className="text-sm font-serif font-bold text-pink-950 group-hover:text-pink-600 transition-colors">
                          {suggestion.title}
                        </span>
                      </div>
                      {suggestion.author && (
                        <p className="text-xs font-sans text-pink-700">by {suggestion.author}</p>
                      )}
                      {suggestion.publication && (
                        <p className="text-xs font-sans text-pink-600/80">in {suggestion.publication}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
                      <span>Select</span>
                      <IconArrowRight size={13} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSuggestions([]);
              setDescription('');
            }}
            className="w-full rounded-full bg-white/80 py-2.5 text-xs font-sans font-semibold text-pink-700 hover:text-pink-950 border border-pink-200 transition-colors"
          >
            Try Another Description
          </button>
        </div>
      ) : formData ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="whimsical-card space-y-4 p-6 sm:p-8">
            <div>
              <label htmlFor="type" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Item Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ReadingItemType)}
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="book">📖 Book</option>
                <option value="article">✨ Article / Essay</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div className={formData.type === 'article' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : ''}>
              <div>
                <label htmlFor="author" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {formData.type === 'article' && (
                <div>
                  <label htmlFor="publication" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                    Publication / Source
                  </label>
                  <input
                    id="publication"
                    type="text"
                    value={formData.publication}
                    onChange={(e) => handleInputChange('publication', e.target.value)}
                    className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="url" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Link / URL (optional)
              </label>
              <input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="year" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {formData.type === 'book' && (
                <div>
                  <label htmlFor="pages" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                    Page Count
                  </label>
                  <input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Genre / Category
              </label>
              <input
                id="genre"
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div>
              <label htmlFor="readDate" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Read Date *
              </label>
              <input
                id="readDate"
                type="date"
                value={formData.readDate}
                onChange={(e) => handleInputChange('readDate', e.target.value)}
                required
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => {
                  const currentRating = formData.rating ? parseInt(formData.rating, 10) : 0;
                  const isFilled = value <= currentRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange('rating', String(value === currentRating ? '' : value))}
                      className="transition-transform active:scale-90 p-1"
                      aria-label={`Rate ${value} out of 5 stars`}
                    >
                      {isFilled ? (
                        <IconStarFilled size={22} className="text-amber-400 fill-amber-400" />
                      ) : (
                        <IconStar size={22} className="text-pink-200 hover:text-amber-300" />
                      )}
                    </button>
                  );
                })}
                {formData.rating && (
                  <span className="ml-2 text-xs font-sans font-bold text-pink-700">
                    ({formData.rating}/5)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., programming, cozy, psychology"
                className="w-full bg-white/95 px-3.5 py-2 text-xs font-sans rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-xs font-sans font-semibold text-pink-950">
                Notes & Reflections
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px] w-full bg-white/95 p-3.5 text-xs font-sans leading-relaxed rounded-xl border border-pink-200 text-pink-950 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(null);
                setDescription('');
                setError(null);
              }}
              className="whimsical-btn-secondary flex-1 text-xs py-3"
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="whimsical-btn-primary flex-1 text-xs py-3 disabled:opacity-50"
            >
              <IconSparkles size={14} />
              <span>{isSubmitting ? 'Saving...' : 'Add to Collection'}</span>
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}
