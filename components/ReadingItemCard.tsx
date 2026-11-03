'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconArticle,
  IconStarFilled,
  IconStar,
  IconEdit,
  IconTrash,
  IconExternalLink,
} from '@tabler/icons-react';
import { ReadingItem, ReadingItemType } from '@/types';
import { formatReadDate } from '@/utils/date';
import { BookCover } from './BookSpine';

interface ReadingItemCardProps {
  item: ReadingItem;
  canEdit?: boolean;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
  onItemUpdated?: (item: ReadingItem) => void;
  onItemDeleted?: (id: string) => void;
}

const BOOK_TYPE: ReadingItemType = 'book';

function formatYearAndPages(year?: number, pages?: number): string {
  const parts: string[] = [];
  if (year) parts.push(year.toString());
  if (pages) parts.push(`${pages} pages`);
  return parts.join(' • ');
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
                      className="p-0.5 transition-transform active:scale-95 text-pink-500"
                      aria-label={`Set rating to ${value}`}
                    >
                      {isFilled ? (
                        <IconStarFilled size={18} className="text-pink-500 fill-pink-500" />
                      ) : (
                        <IconStar size={18} className="text-pink-300" />
                      )}
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
    <article className="bookplate group relative flex h-full flex-col rounded-sm p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="relative flex flex-1 flex-col">
        {/* Header bar: badge + rating + actions */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 text-[10px] font-serif uppercase tracking-wider border border-gold/40 text-pink-900 bg-white/70 shadow-2xs"
            >
              {isBook ? <IconBook size={12} className="text-gold" /> : <IconArticle size={12} className="text-gold" />}
              <span>{isBook ? 'Book' : 'Article'}</span>
            </span>
            {item.rating && (
              <div className="flex items-center gap-0.5 text-gold" title={`${item.rating}/5 stars`}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IconStarFilled key={i} size={11} />
                ))}
              </div>
            )}
          </div>

          {canEdit && !isConfirmingDelete && (
            <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit item"
                aria-label={`Edit ${item.title}`}
                className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-serif text-pink-800 hover:bg-pink-100/70 border border-gold/30"
              >
                <IconEdit size={12} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                title="Delete item"
                aria-label={`Delete ${item.title}`}
                className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-serif text-pink-800 hover:bg-red-50 hover:text-red-700 border border-gold/30"
              >
                <IconTrash size={12} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {isConfirmingDelete && (
          <div
            className="mb-3 flex items-center justify-between gap-2 rounded-sm p-2.5 text-xs border border-pink-300 bg-pink-50"
          >
            <span className="font-serif font-semibold text-pink-900">
              Remove this item?
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
                className="rounded-sm px-2.5 py-1 font-serif text-pink-900 bg-white border border-pink-300 hover:bg-pink-100/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-sm bg-pink-700 px-2.5 py-1 font-serif font-semibold text-white hover:bg-pink-800"
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

        {/* Content layout: if book, show miniature vintage cover alongside details */}
        <div className="flex gap-4">
          {isBook && (
            <div className="hidden xs:block sm:block shrink-0 pt-0.5">
              <BookCover book={item} size="sm" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-base sm:text-lg leading-snug tracking-tight text-pink-900">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-pink-700"
                >
                  <span>{item.title}</span>
                  <IconExternalLink size={13} className="text-gold shrink-0 opacity-80" />
                </a>
              ) : (
                item.title
              )}
            </h3>

            {item.author && (
              <p className="mt-1 font-serif italic text-xs text-pink-800/85">
                by {item.author}
              </p>
            )}

            {item.publication && (
              <p className="mt-0.5 font-serif text-[11px] text-pink-800/70">
                Published in <span className="italic">{item.publication}</span>
              </p>
            )}

            {yearAndPages && (
              <p className="mt-1 text-[11px] font-serif text-pink-800/70">
                {yearAndPages}
                {item.genre && <> · <span className="italic">{item.genre}</span></>}
              </p>
            )}

            {item.description && (
              <p className="mt-2.5 border-l-2 border-gold/50 pl-2.5 text-xs font-serif italic leading-relaxed text-pink-900/80 line-clamp-3">
                &ldquo;{item.description}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Card footer: Read on date + Tags */}
        <div className="mt-auto pt-3 border-t border-gold/25">
          <div className="flex items-center justify-between text-[11px] font-serif text-pink-800/75">
            <span>
              Read on <span className="font-semibold text-pink-900">{formatReadDate(item.readDate)}</span>
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-pink-800 hover:text-pink-950 hover:underline"
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
                    className={`rounded-xs px-2 py-0.5 text-[11px] font-serif transition-all border ${
                      isSelected
                        ? 'bg-[#9E384D] text-white border-[#8A2F42] shadow-xs'
                        : 'bg-[#FFFAF5] text-[#5A2232] border-[rgba(212,175,55,0.35)] hover:border-[#D4AF37]'
                    }`}
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
