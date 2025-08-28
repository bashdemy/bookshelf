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
import { Plus, Loader2, FileText } from 'lucide-react';

export default function AddArticleForm() {
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
      url: formData.get('url') as string,
      author: formData.get('author') as string,
      publication: formData.get('publication') as string,
      summary: formData.get('summary') as string,
      notes: formData.get('notes') as string,
      tags: formData.get('tags') as string,
      status: formData.get('status') as string,
      adminKey: formData.get('adminKey') as string,
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Article added successfully! ✨');
        e.currentTarget.reset();
        setIsExpanded(false);
        window.location.reload();
      } else {
        const error = await response.text();
        setMessage(`Error: ${error}`);
      }
    } catch {
      setMessage('Error adding article. Please try again.');
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
            <div className="p-2 bg-secondary rounded-xl shadow-cute">
              <FileText className="w-5 h-5 text-secondary-foreground" />
            </div>
            <CardTitle className="font-cute text-xl">Add New Article</CardTitle>
          </div>
          <Plus
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
          />
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-cute">
                Title *
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                required
                placeholder="Enter article title..."
                className="input-cute"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="font-cute">
                URL
              </Label>
              <Input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com/article..."
                className="input-cute"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author" className="font-cute">
                  Author
                </Label>
                <Input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="Enter author name..."
                  className="input-cute"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publication" className="font-cute">
                  Publication
                </Label>
                <Input
                  type="text"
                  id="publication"
                  name="publication"
                  placeholder="e.g., Medium, TechCrunch..."
                  className="input-cute"
                />
              </div>
            </div>

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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="font-cute">
                Summary
              </Label>
              <Textarea
                id="summary"
                name="summary"
                rows={3}
                placeholder="Brief summary of the article..."
                className="input-cute resize-none"
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
                placeholder="Your thoughts and notes about this article..."
                className="input-cute resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="font-cute">
                Tags
              </Label>
              <Input
                type="text"
                id="tags"
                name="tags"
                placeholder="tech, programming, ai (comma-separated)"
                className="input-cute"
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
                placeholder="Enter admin key to add article"
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
              variant="cute-secondary"
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
                  Add Article
                </>
              )}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
