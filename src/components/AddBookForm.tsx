'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, BookOpen } from 'lucide-react';

export default function AddBookForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
      rating: formData.get('rating')
        ? parseInt(formData.get('rating') as string)
        : undefined,
      pages: formData.get('pages')
        ? parseInt(formData.get('pages') as string)
        : undefined,
      genre: formData.get('genre') as string,
      adminKey: encodeURIComponent(formData.get('adminKey') as string),
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Book added successfully! ✨');
        e.currentTarget.reset();
        setIsExpanded(false);
        window.location.reload();
      } else {
        const errorData = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as {
          details?: string;
          error?: string;
        };
        const errorMessage =
          errorData.details || errorData.error || 'Unknown error occurred';
        setMessage(`Error: ${errorMessage}`);
      }
    } catch {
      setMessage('Error adding book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-cute">
      <CardHeader>
        <Button
          variant="cute-ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-0 h-auto rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-cute">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <CardTitle className="font-cute text-xl">Add New Book</CardTitle>
          </div>
          <Plus
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
          />
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-cute">
                  Title *
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Enter book title..."
                  className="input-cute"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="font-cute">
                  Author *
                </Label>
                <Input
                  type="text"
                  id="author"
                  name="author"
                  required
                  placeholder="Enter author name..."
                  className="input-cute"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="font-cute">
                  Status
                </Label>
                <Select name="status" defaultValue="to-read">
                  <SelectTrigger className="input-cute">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-read">To Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="font-cute">
                  Rating
                </Label>
                <Select name="rating">
                  <SelectTrigger className="input-cute">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pages" className="font-cute">
                  Pages
                </Label>
                <Input
                  type="number"
                  id="pages"
                  name="pages"
                  placeholder="Number of pages..."
                  className="input-cute"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="font-cute">
                Genre
              </Label>
              <Input
                type="text"
                id="genre"
                name="genre"
                placeholder="e.g., Fiction, Non-fiction, Science..."
                className="input-cute"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-cute">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any thoughts or notes about this book..."
                className="input-cute resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminKey" className="font-cute">
                Admin Key *
              </Label>
              <Input
                type="password"
                id="adminKey"
                name="adminKey"
                required
                placeholder="Enter admin key to add book"
                className="input-cute"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl border-2 font-cute ${
                  message.includes('Error')
                    ? 'bg-destructive/10 text-destructive border-destructive/20'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-cute"
              variant="cute"
              size="cute-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </>
              )}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
