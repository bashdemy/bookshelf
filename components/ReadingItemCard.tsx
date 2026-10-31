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
  const isBook = item.type === 'book';

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
        className="flex h-full flex-col p-6"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary)',
          background: 'var(--paper)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <form onSubmit={handleSaveEdit} className="flex flex-1 flex-col space-y-3 text-xs">
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--color-divider)' }}>
            <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Edit Reading Item
            </span>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ReadingItemType })}
              className="bg-white px-2 py-1 text-xs font-semibold"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground)',
              }}
            >
              <option value="book">📖 Book</option>
              <option value="article">✨ Article</option>
            </select>
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Title *
            </label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Author
              </label>
              <input
                type="text"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
                {editForm.type === 'book' ? 'Pages' : 'Publication'}
              </label>
              {editForm.type === 'book' ? (
                <input
                  type="number"
                  value={editForm.pages}
                  onChange={(e) => setEditForm({ ...editForm, pages: e.target.value })}
                  className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-divider)',
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={editForm.publication}
                  onChange={(e) => setEditForm({ ...editForm, publication: e.target.value })}
                  className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-divider)',
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Year
              </label>
              <input
                type="number"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Genre
              </label>
              <input
                type="text"
                value={editForm.genre}
                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Read Date *
              </label>
              <input
                type="date"
                required
                value={editForm.readDate}
                onChange={(e) => setEditForm({ ...editForm, readDate: e.target.value })}
                className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-divider)',
                }}
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
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
                      className="text-base transition-transform active:scale-95"
                    >
                      {isFilled ? '❤️' : '🤍'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Link / URL
            </label>
            <input
              type="url"
              value={editForm.url}
              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{
                borderRadius: 'var(--radius-sm)',
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
              className="flex-1 rounded-md bg-white px-3 py-2 text-xs font-semibold"
              style={{
                border: '1px solid var(--color-divider)',
                color: 'var(--color-foreground-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-md px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
              style={{
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-button-primary)',
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
        border: '1px solid var(--color-border)',
        borderLeft: isBook ? '4px solid var(--color-primary)' : '4px solid var(--color-secondary)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = '#D6CEBF';
        if (isBook) e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
        else e.currentTarget.style.borderLeftColor = 'var(--color-secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        if (isBook) e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
        else e.currentTarget.style.borderLeftColor = 'var(--color-secondary)';
      }}
    >
      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span 
                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ 
                    background: isBook ? 'var(--color-primary-soft)' : 'var(--color-secondary-soft)',
                    color: isBook ? 'var(--color-primary-text)' : 'var(--color-secondary-text)',
                  }}
                >
                  {getTypeLabel(item.type)}
                </span>
                {item.rating && (
                  <span className="text-sm leading-none" title={`${item.rating}/5`}>
                    {renderRatingHearts(item.rating)}
                  </span>
                )}
              </div>

              {canEdit && !isConfirmingDelete && (
                <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    title="Edit item"
                    aria-label={`Edit ${item.title}`}
                    className="rounded px-2 py-0.5 text-xs font-medium hover:bg-[#F2EDE4]"
                    style={{ color: 'var(--color-foreground-secondary)' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    title="Delete item"
                    aria-label={`Delete ${item.title}`}
                    className="rounded px-2 py-0.5 text-xs font-medium hover:bg-red-50"
                    style={{ color: 'var(--color-error)' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {isConfirmingDelete && (
              <div
                className="mb-3 flex items-center justify-between gap-2 rounded-md p-2.5 text-xs"
                style={{
                  background: '#FFF5F5',
                  border: '1px solid #F5C6CB',
                }}
              >
                <span className="font-semibold text-red-800">
                  Delete this item?
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="rounded px-2 py-1 font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded bg-red-700 px-2.5 py-1 font-bold text-white hover:bg-red-800"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="mb-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <h3 className="mb-2 text-lg font-bold leading-snug tracking-tight" style={{ color: 'var(--color-foreground)' }}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title} <span className="text-xs font-normal opacity-60">↗</span>
                </a>
              ) : (
                item.title
              )}
            </h3>
          </div>
        </div>

        <div className="mb-4 flex-1 space-y-1.5 text-xs leading-relaxed">
          {item.author && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: 'var(--color-foreground-secondary)' }}>
                Author
              </span>
              <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>{item.author}</span>
            </div>
          )}
          {item.publication && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: 'var(--color-foreground-secondary)' }}>
                Publication
              </span>
              <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>{item.publication}</span>
            </div>
          )}
          {yearAndPages && (
            <p className="font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
              {yearAndPages}
            </p>
          )}
          {item.genre && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: 'var(--color-foreground-secondary)' }}>
                Genre
              </span>
              <span className="font-medium capitalize" style={{ color: 'var(--color-foreground)' }}>{item.genre}</span>
            </div>
          )}
          {item.description && (
            <p
              className="mt-2.5 border-l-2 pl-2.5 text-xs italic leading-relaxed"
              style={{
                borderColor: 'var(--color-divider)',
                color: 'var(--color-foreground-secondary)',
              }}
            >
              &ldquo;{item.description}&rdquo;
            </p>
          )}
        </div>

        <div className="mt-auto border-t pt-3" style={{ borderColor: 'var(--color-divider)' }}>
          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: 'var(--color-foreground-secondary)' }}>
              Read on <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatReadDate(item.readDate)}</span>
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: 'var(--color-secondary)' }}
              >
                Source ↗
              </a>
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {item.tags.map((tag) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick && onTagClick(tag)}
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                      onTagClick ? 'cursor-pointer hover:border-[#C8BFB0]' : 'cursor-default'
                    }`}
                    style={{ 
                      background: isSelected ? 'var(--color-secondary)' : 'var(--color-tag-bg)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-tag-text)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
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
