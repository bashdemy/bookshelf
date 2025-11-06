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
  year?: string;
  pages?: string;
  genre?: string;
  tags?: string;
  description?: string;
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
      year: suggestion.year || '',
      pages: suggestion.pages || '',
      genre: suggestion.genre || '',
      tags: suggestion.tags || '',
      description: suggestion.description || '',
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
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          Add Reading Item
        </h1>
        <p className="mt-2" style={{ color: 'var(--color-foreground-secondary)' }}>
          Describe what you've read and let AI help fill in the details
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!formData && suggestions.length === 0 ? (
        <div className="p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-divider)', background: 'var(--color-paper)' }}>
          <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
            Describe what you read
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I read Clean Code by Robert C. Martin"
            className="w-full bg-white px-4 py-3 focus:outline-none focus:ring-2 min-h-[120px]"
            style={{ 
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-foreground)',
            }}
            disabled={isProcessing}
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleManualEntry}
              className="flex-1 bg-white px-6 py-3 font-bold transition-colors"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-primary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-blush)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Manual Entry
            </button>
            <button
              onClick={handleAIProcess}
              disabled={isProcessing || !description.trim()}
              className="flex-1 px-6 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ 
                borderRadius: 'var(--radius-base)',
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-primary)',
              }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-primary-dark)')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              {isProcessing ? 'Finding suggestions...' : 'Get AI Suggestions'}
            </button>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          <div className="p-6" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-divider)', background: 'var(--color-paper)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              Select a suggestion:
            </h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left bg-white p-4 transition-colors"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-blush)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">
                          {suggestion.type === 'book' ? '📖' : '✨'}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                          {suggestion.title}
                        </span>
                      </div>
                      {suggestion.author && (
                        <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>by {suggestion.author}</p>
                      )}
                      {suggestion.publication && (
                        <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>in {suggestion.publication}</p>
                      )}
                    </div>
                    <span style={{ color: 'var(--color-secondary)' }}>→</span>
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
            className="w-full bg-white px-6 py-3 font-bold transition-colors"
            style={{ 
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-primary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-blush)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            Try Again
          </button>
        </div>
      ) : formData ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 space-y-6" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-divider)', background: 'var(--color-paper)' }}>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ReadingItemType)}
                className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
              >
                <option value="book">📖 Book</option>
                <option value="article">✨ Article</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
              />
            </div>

            {formData.type === 'book' ? (
              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-foreground)',
                    '--tw-ring-color': 'var(--color-primary)',
                  } as React.CSSProperties}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="publication" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                  Publication
                </label>
                <input
                  id="publication"
                  type="text"
                  value={formData.publication}
                  onChange={(e) => handleInputChange('publication', e.target.value)}
                  className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-foreground)',
                    '--tw-ring-color': 'var(--color-primary)',
                  } as React.CSSProperties}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                  style={{ 
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-foreground)',
                    '--tw-ring-color': 'var(--color-primary)',
                  } as React.CSSProperties}
                />
              </div>

              {formData.type === 'book' && (
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                    Pages
                  </label>
                  <input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                    style={{ 
                      borderRadius: 'var(--radius-base)',
                      border: '1px solid var(--color-divider)',
                      color: 'var(--color-foreground)',
                      '--tw-ring-color': 'var(--color-primary)',
                    } as React.CSSProperties}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Genre
              </label>
              <input
                id="genre"
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
              />
            </div>

            <div>
              <label htmlFor="readDate" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Read Date *
              </label>
              <input
                id="readDate"
                type="date"
                value={formData.readDate}
                onChange={(e) => handleInputChange('readDate', e.target.value)}
                required
                className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const currentRating = formData.rating ? parseInt(formData.rating, 10) : 0;
                  const isFilled = value <= currentRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange('rating', String(value === currentRating ? '' : value))}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none focus:ring-2"
                      style={{ borderRadius: 'var(--radius-base)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                      aria-label={`Rate ${value} out of 5`}
                    >
                      {isFilled ? '❤️' : '🤍'}
                    </button>
                  );
                })}
                {formData.rating && (
                  <span className="text-sm ml-2" style={{ color: 'var(--color-foreground-secondary)' }}>
                    ({formData.rating}/5)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., programming, best-practices, software-engineering"
                className="w-full bg-white px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-white px-4 py-3 focus:outline-none focus:ring-2 min-h-[100px]"
                style={{ 
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-foreground)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}
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
              className="flex-1 bg-white px-6 py-3 font-bold transition-colors"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-primary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-blush)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ 
                borderRadius: 'var(--radius-base)',
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-primary)',
              }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-primary-dark)')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              {isSubmitting ? 'Adding...' : 'Add to Collection'}
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}

