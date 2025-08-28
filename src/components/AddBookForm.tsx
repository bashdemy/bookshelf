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
import { Plus, Loader2 } from 'lucide-react';

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
      adminKey: formData.get('adminKey') as string,
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
        setMessage('Book added successfully!');
        e.currentTarget.reset();
        setIsExpanded(false);
        window.location.reload();
      } else {
        const error = await response.text();
        setMessage(`Error: ${error}`);
      }
    } catch {
      setMessage('Error adding book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-0 h-auto"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <CardTitle>Add New Book</CardTitle>
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Enter book title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  type="text"
                  id="author"
                  name="author"
                  required
                  placeholder="Enter author name..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="to-read">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-read">To Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select name="rating">
                  <SelectTrigger>
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
                <Label htmlFor="pages">Pages</Label>
                <Input
                  type="number"
                  id="pages"
                  name="pages"
                  placeholder="Number of pages..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                type="text"
                id="genre"
                name="genre"
                placeholder="e.g., Fiction, Non-fiction, Science..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any thoughts or notes about this book..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key *</Label>
              <Input
                type="password"
                id="adminKey"
                name="adminKey"
                required
                placeholder="Enter admin key to add book"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.includes('Error')
                    ? 'bg-destructive/10 text-destructive border-destructive/20'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                }`}
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
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
