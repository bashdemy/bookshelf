'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconArticle,
  IconArrowRight,
  IconSparkles,
  IconPencil,
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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif tracking-tight text-pink-950">
          Log a New Book or Article
        </h1>
        <p className="mt-1 text-xs font-serif text-pink-900/70">
          Add a volume to the shelves, paste a link, or enter details manually
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          {error}
        </div>
      )}

      {!formData && suggestions.length === 0 ? (
        <div
          className="p-6"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--paper)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <label htmlFor="description" className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-foreground)' }}>
            Describe what you read or paste a link
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Designing Data-Intensive Applications by Martin Kleppmann OR paste an article URL..."
            className="min-h-[110px] w-full bg-white p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
            style={{ 
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
            disabled={isProcessing}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleManualEntry}
              className="flex-1 rounded-md px-4 py-2.5 text-xs font-semibold transition-all active:translate-y-[1px]"
              style={{ 
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
                boxShadow: 'var(--shadow-button-secondary)',
              }}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={handleAIProcess}
              disabled={isProcessing || !description.trim()}
              className="flex-1 rounded-md px-4 py-2.5 text-xs font-serif font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
              style={{ 
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-button-primary)',
              }}
            >
              {isProcessing ? 'Looking up...' : 'Auto-Fill Details'}
            </button>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          <div
            className="p-5"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--paper)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-foreground)' }}>
              Extracted Suggestion
            </h2>
            <div className="space-y-2.5">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left p-3.5 transition-all hover:bg-[#F9F7F4]"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-border)',
                    background: '#FFFFFF',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className="text-pink-600">
                          {suggestion.type === 'book' ? <IconBook size={15} /> : <IconArticle size={15} />}
                        </span>
                        <span className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                          {suggestion.title}
                        </span>
                      </div>
                      {suggestion.author && (
                        <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>by {suggestion.author}</p>
                      )}
                      {suggestion.publication && (
                        <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>in {suggestion.publication}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
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
            className="w-full rounded-md bg-white py-2.5 text-xs font-semibold"
            style={{ 
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground-secondary)',
            }}
          >
            Try Another Description
          </button>
        </div>
      ) : formData ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="space-y-4 p-6"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--paper)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div>
              <label htmlFor="type" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Item Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ReadingItemType)}
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                <option value="book">📖 Book</option>
                <option value="article">✨ Article</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            <div className={formData.type === 'article' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : ''}>
              <div>
                <label htmlFor="author" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                />
              </div>

              {formData.type === 'article' && (
                <div>
                  <label htmlFor="publication" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    Publication
                  </label>
                  <input
                    id="publication"
                    type="text"
                    value={formData.publication}
                    onChange={(e) => handleInputChange('publication', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                    style={{ 
                      borderRadius: 'var(--radius-base)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="url" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Link / URL (optional)
              </label>
              <input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://..."
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="year" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                />
              </div>

              {formData.type === 'book' && (
                <div>
                  <label htmlFor="pages" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    Pages
                  </label>
                  <input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                    style={{ 
                      borderRadius: 'var(--radius-base)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Genre
              </label>
              <input
                id="genre"
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            <div>
              <label htmlFor="readDate" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Read Date *
              </label>
              <input
                id="readDate"
                type="date"
                value={formData.readDate}
                onChange={(e) => handleInputChange('readDate', e.target.value)}
                required
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
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
                      className="text-2xl transition-transform active:scale-90"
                      aria-label={`Rate ${value} out of 5`}
                    >
                      {isFilled ? '❤️' : '🤍'}
                    </button>
                  );
                })}
                {formData.rating && (
                  <span className="ml-2 text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                    ({formData.rating}/5)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., programming, architecture, databases"
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Description / Notes
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[90px] w-full bg-white p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
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
              className="flex-1 rounded-md bg-white py-2.5 text-xs font-semibold"
              style={{ 
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground-secondary)',
              }}
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md py-2.5 text-xs font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
              style={{ 
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-button-primary)',
              }}
            >
              {isSubmitting ? 'Cataloging...' : 'Add to Collection'}
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}
