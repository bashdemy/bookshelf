'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  IconSearch,
  IconBooks,
  IconArticle,
  IconPlus,
} from '@tabler/icons-react';
import { ReadingItem } from '@/types';
import ReadingItemCard from './ReadingItemCard';
import { formatItemCount } from '@/utils/statistics';

interface ReadingSectionProps {
  title: string;
  items: ReadingItem[];
  singularLabel: string;
  pluralLabel: string;
  canEdit?: boolean;
}

type SortOption = 'date-desc' | 'date-asc' | 'rating-desc' | 'title-asc' | 'pages-desc';

export default function ReadingSection({
  title,
  items: initialItems,
  singularLabel,
  pluralLabel,
  canEdit = false,
}: ReadingSectionProps) {
  const [items, setItems] = useState<ReadingItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.genre) set.add(item.genre);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.tags) {
        for (const tag of item.tags) {
          set.add(tag);
        }
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const hasBooks = useMemo(() => items.some((i) => i.type === 'book'), [items]);

  const filteredAndSortedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (selectedGenre && item.genre !== selectedGenre) {
        return false;
      }
      if (selectedTag && (!item.tags || !item.tags.includes(selectedTag))) {
        return false;
      }
      if (selectedRating && (item.rating || 0) < parseInt(selectedRating, 10)) {
        return false;
      }
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesAuthor = item.author?.toLowerCase().includes(query) || false;
        const matchesPub = item.publication?.toLowerCase().includes(query) || false;
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        const matchesGenre = item.genre?.toLowerCase().includes(query) || false;
        const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        return matchesTitle || matchesAuthor || matchesPub || matchesDesc || matchesGenre || matchesTag;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.readDate).getTime() - new Date(b.readDate).getTime();
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'pages-desc':
          return (b.pages || 0) - (a.pages || 0);
        case 'date-desc':
        default:
          return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      }
    });
  }, [items, searchQuery, selectedGenre, selectedTag, selectedRating, sortBy]);

  const hasActiveFilters = Boolean(searchQuery || selectedGenre || selectedTag || selectedRating);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedTag('');
    setSelectedRating('');
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? '' : tag));
  };

  const handleItemUpdated = (updated: ReadingItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleItemDeleted = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="mb-14">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight" style={{ color: 'var(--color-foreground)' }}>
            {title}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
            {hasActiveFilters
              ? `Showing ${filteredAndSortedItems.length} of ${formatItemCount(items.length, singularLabel, pluralLabel)}`
              : formatItemCount(items.length, singularLabel, pluralLabel)}
          </p>
        </div>

        {canEdit && (
          <Link
            href="/add"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-all active:translate-y-[1px]"
            style={{
              background: 'var(--color-primary)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: 'var(--shadow-button-primary)',
            }}
          >
            + Add {singularLabel.charAt(0).toUpperCase() + singularLabel.slice(1)}
          </Link>
        )}
      </div>

      {items.length > 0 && (
        <div
          className="mb-7 p-4"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--paper)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 relative flex items-center">
              <IconSearch size={14} className="absolute left-3 text-pink-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${pluralLabel} by title, author, tag...`}
                aria-label={`Search ${pluralLabel}`}
                className="w-full bg-white pl-8 pr-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            {genres.length > 0 && (
              <div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  aria-label="Filter by genre"
                  className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <option value="">All Genres ({items.length})</option>
                  {genres.map((genre) => {
                    const count = items.filter((i) => i.genre === genre).length;
                    return (
                      <option key={genre} value={genre}>
                        {genre} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  aria-label="Filter by tag"
                  className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                  style={{
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort items"
                className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
                style={{
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                <option value="date-desc">Newest Read</option>
                <option value="date-asc">Oldest Read</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="title-asc">Title (A–Z)</option>
                {hasBooks && <option value="pages-desc">Most Pages</option>}
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          {genres.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t" style={{ borderColor: 'var(--color-divider)' }}>
              <span className="text-[11px] font-bold text-pink-950 mr-1">Categories:</span>
              <button
                type="button"
                onClick={() => setSelectedGenre('')}
                className={`rounded-full px-2.5 py-0.5 text-[11px] transition-all ${
                  !selectedGenre
                    ? 'bg-pink-600 text-white font-bold shadow-sm shadow-pink-600/25'
                    : 'bg-pink-50 text-pink-900 border border-pink-200/70 hover:bg-pink-100'
                }`}
              >
                All ({items.length})
              </button>
              {genres.map((genre) => {
                const count = items.filter((i) => i.genre === genre).length;
                const isSelected = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setSelectedGenre(isSelected ? '' : genre)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] transition-all ${
                      isSelected
                        ? 'bg-pink-600 text-white font-bold shadow-sm shadow-pink-600/25'
                        : 'bg-pink-50 text-pink-900 border border-pink-200/70 hover:bg-pink-100'
                    }`}
                  >
                    {genre} <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-xs" style={{ borderColor: 'var(--color-divider)' }}>
              <div className="flex flex-wrap items-center gap-1.5">
                <span style={{ color: 'var(--color-foreground-secondary)' }}>Filtered by:</span>
                {searchQuery && (
                  <span
                    className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
                    style={{ background: '#ECE7DE', color: '#454038' }}
                  >
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                {selectedGenre && (
                  <span
                    className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
                    style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-text)' }}
                  >
                    Genre: {selectedGenre}
                  </span>
                )}
                {selectedTag && (
                  <span
                    className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
                    style={{ background: 'var(--color-secondary-soft)', color: 'var(--color-secondary-text)' }}
                  >
                    #{selectedTag}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center p-12 text-center"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-divider)',
            background: 'var(--paper)',
          }}
        >
          <div className="mb-3 flex items-center justify-center h-14 w-14 rounded-2xl bg-pink-100 text-pink-600 border border-pink-200">
            {singularLabel === 'book' ? <IconBooks size={28} /> : <IconArticle size={28} />}
          </div>
          <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
            No {pluralLabel} tracked yet
          </h3>
          <p className="mb-5 max-w-sm text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
            {canEdit
              ? `Start building your library by cataloging the first ${singularLabel} you've read.`
              : `This bookshelf doesn't have any ${pluralLabel} cataloged yet.`}
          </p>
          {canEdit && (
            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold text-white transition-all active:translate-y-[1px]"
              style={{
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow-button-primary)',
              }}
            >
              <IconPlus size={14} />
              <span>Add Your First {singularLabel.charAt(0).toUpperCase() + singularLabel.slice(1)}</span>
            </Link>
          )}
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center p-10 text-center"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--paper)',
          }}
        >
          <p className="mb-1 text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
            No matching {pluralLabel} found
          </p>
          <p className="mb-4 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
            Try refining your keywords or clearing active filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full px-4 py-1.5 text-xs font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedItems.map((item) => (
            <ReadingItemCard
              key={item.id}
              item={item}
              canEdit={canEdit}
              onTagClick={handleTagClick}
              activeTag={selectedTag}
              onItemUpdated={handleItemUpdated}
              onItemDeleted={handleItemDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
}
