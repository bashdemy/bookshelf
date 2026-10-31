'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingItem, ReadingItemType } from '@/types';
import { formatReadDate } from '@/utils/date';

interface ReadingItemCardProps {
  item: ReadingItem;
  canEdit?: boolean;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
  onItemUpdated?: (item: ReadingItem) => void;
  onItemDeleted?: (id: string) => void;
}

const HEART_EMOJI = '❤️';
const BOOK_TYPE: ReadingItemType = 'book';
const BOOK_LABEL = '📖 Book';
const ARTICLE_LABEL = '✨ Article';

function formatYearAndPages(year?: number, pages?: number): string {
  const parts: string[] = [];
  if (year) parts.push(year.toString());
  if (pages) parts.push(`${pages} pages`);
  return parts.join(' • ');
}

function renderRatingHearts(rating: number): string {
  return HEART_EMOJI.repeat(rating);
}

function getTypeLabel(type: ReadingItemType): string {
  return type === BOOK_TYPE ? BOOK_LABEL : ARTICLE_LABEL;
}

export default function ReadingItemCard({
  item,
  canEdit = false,
  onTagClick,
  activeTag,
  onItemUpdated,
  onItemDeleted,
}: ReadingItemCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    type: item.type,
    title: item.title,
    author: item.author || '',
    publication: item.publication || '',
    year: item.year ? String(item.year) : '',
    pages: item.pages ? String(item.pages) : '',
    genre: item.genre || '',
    tags: item.tags ? item.tags.join(', ') : '',
    description: item.description || '',
    url: item.url || '',
    readDate: item.readDate ? item.readDate.split('T')[0] : new Date().toISOString().split('T')[0],
    rating: item.rating ? String(item.rating) : '',
  });

  const yearAndPages = formatYearAndPages(item.year, item.pages);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload: Omit<ReadingItem, 'id'> = {
        type: editForm.type,
        title: editForm.title.trim(),
        author: editForm.author.trim() || undefined,
        publication: editForm.publication.trim() || undefined,
        year: editForm.year ? parseInt(editForm.year, 10) : undefined,
        pages: editForm.pages ? parseInt(editForm.pages, 10) : undefined,
        genre: editForm.genre.trim() || undefined,
        tags: editForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        description: editForm.description.trim() || undefined,
        url: editForm.url.trim() || undefined,
        readDate: editForm.readDate,
        rating: editForm.rating ? parseInt(editForm.rating, 10) : undefined,
      };

      if (!payload.title) {
        throw new Error('Title is required');
      }

      const response = await fetch(`/api/reading-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: payload }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update item');
      }

      const data = await response.json();
      setIsEditing(false);
      if (onItemUpdated && data.item) {
        onItemUpdated(data.item);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reading-items/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete item');
      }

      setIsConfirmingDelete(false);
      if (onItemDeleted) {
        onItemDeleted(item.id);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <article
        className="flex h-full flex-col overflow-hidden p-6"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-primary)',
          background: 'var(--color-paper)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <form onSubmit={handleSaveEdit} className="flex flex-1 flex-col space-y-3 text-sm">
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--color-divider)' }}>
            <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
              Edit Reading Item
            </span>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ReadingItemType })}
              className="bg-white px-2 py-1 text-xs font-semibold"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground)',
              }}
            >
              <option value="book">📖 Book</option>
              <option value="article">✨ Article</option>
            </select>
          </div>

          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              Title *
            </label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-white px-3 py-1.5 text-sm"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Author
              </label>
              <input
                type="text"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-sm"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                {editForm.type === 'book' ? 'Pages' : 'Publication'}
              </label>
              {editForm.type === 'book' ? (
                <input
                  type="number"
                  value={editForm.pages}
                  onChange={(e) => setEditForm({ ...editForm, pages: e.target.value })}
                  className="w-full bg-white px-3 py-1.5 text-sm"
                  style={{
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={editForm.publication}
                  onChange={(e) => setEditForm({ ...editForm, publication: e.target.value })}
                  className="w-full bg-white px-3 py-1.5 text-sm"
                  style={{
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-divider)',
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Year
              </label>
              <input
                type="number"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-sm"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Genre
              </label>
              <input
                type="text"
                value={editForm.genre}
                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-sm"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Read Date *
              </label>
              <input
                type="date"
                required
                value={editForm.readDate}
                onChange={(e) => setEditForm({ ...editForm, readDate: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-sm"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Rating
              </label>
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((value) => {
                  const currentRating = editForm.rating ? parseInt(editForm.rating, 10) : 0;
                  const isFilled = value <= currentRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          rating: String(value === currentRating ? '' : value),
                        })
                      }
                      className="text-lg transition-transform hover:scale-110"
                    >
                      {isFilled ? '❤️' : '🤍'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              Link / URL
            </label>
            <input
              type="url"
              value={editForm.url}
              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-white px-3 py-1.5 text-sm"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="w-full bg-white px-3 py-1.5 text-sm"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full bg-white px-3 py-1.5 text-sm"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div className="mt-auto flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              className="flex-1 bg-white px-3 py-2 text-xs font-bold"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
              style={{
                borderRadius: 'var(--radius-base)',
                background: 'var(--color-primary)',
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article 
      className="group relative flex h-full flex-col overflow-hidden p-6 transition-all"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-divider)',
        background: 'var(--color-paper)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        e.currentTarget.style.background = 'var(--color-accent-blush)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.background = 'var(--color-paper)';
      }}
    >
      <div className="relative flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
                  style={{ 
                    borderRadius: 'var(--radius-full)',
                    background: item.type === 'book' ? 'var(--color-accent-blush)' : 'var(--color-accent-lavender)',
                    color: 'var(--color-accent-plum)',
                  }}
                >
                  {getTypeLabel(item.type)}
                </span>
                {item.rating && (
                  <span className="text-base leading-none" style={{ color: 'var(--color-primary)' }}>
                    {renderRatingHearts(item.rating)}
                  </span>
                )}
              </div>

              {canEdit && !isConfirmingDelete && (
                <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    title="Edit item"
                    aria-label={`Edit ${item.title}`}
                    className="px-2 py-1 text-xs font-medium transition-colors hover:bg-white/80"
                    style={{
                      borderRadius: 'var(--radius-base)',
                      color: 'var(--color-accent-plum)',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    title="Delete item"
                    aria-label={`Delete ${item.title}`}
                    className="px-2 py-1 text-xs font-medium transition-colors hover:bg-white/80"
                    style={{
                      borderRadius: 'var(--radius-base)',
                      color: 'var(--color-error)',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            {isConfirmingDelete && (
              <div
                className="mb-3 flex items-center justify-between gap-2 p-2.5 text-xs"
                style={{
                  borderRadius: 'var(--radius-base)',
                  background: 'white',
                  border: '1px solid var(--color-error)',
                }}
              >
                <span className="font-medium" style={{ color: 'var(--color-error)' }}>
                  Delete this item?
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="px-2 py-1 font-semibold"
                    style={{
                      borderRadius: 'var(--radius-base)',
                      color: 'var(--color-foreground-secondary)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-2.5 py-1 font-bold text-white"
                    style={{
                      borderRadius: 'var(--radius-base)',
                      background: 'var(--color-error)',
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="mb-2 text-xs" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
            )}

            <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-snug" style={{ color: 'var(--color-foreground)' }}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title} <span className="text-sm font-normal opacity-75">↗</span>
                </a>
              ) : (
                item.title
              )}
            </h3>
          </div>
        </div>

        <div className="mb-4 flex-1 space-y-2 text-sm leading-relaxed">
          {item.author && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Author:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{item.author}</span>
            </div>
          )}
          {item.publication && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Publication:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{item.publication}</span>
            </div>
          )}
          {yearAndPages && (
            <p style={{ color: 'var(--color-foreground-secondary)' }}>{yearAndPages}</p>
          )}
          {item.genre && (
            <div className="flex items-start gap-2">
              <span className="font-semibold" style={{ color: 'var(--color-foreground-secondary)' }}>Genre:</span>
              <span className="capitalize" style={{ color: 'var(--color-foreground)' }}>{item.genre}</span>
            </div>
          )}
          {item.description && (
            <p
              className="mt-2 line-clamp-3 text-sm italic leading-relaxed"
              style={{ color: 'var(--color-foreground-secondary)' }}
            >
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-auto border-t pt-4" style={{ borderColor: 'var(--color-divider)' }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
              Read on <span style={{ color: 'var(--color-secondary)' }}>{formatReadDate(item.readDate)}</span>
            </p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--color-secondary)' }}
              >
                Source ↗
              </a>
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick && onTagClick(tag)}
                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                      onTagClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    }`}
                    style={{ 
                      borderRadius: 'var(--radius-base)',
                      background: isSelected ? 'var(--color-secondary)' : 'var(--color-accent-lavender)',
                      color: isSelected ? 'white' : 'var(--color-accent-plum)',
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
