import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Sparkles } from 'lucide-react';

export function CuteDemo() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-cute bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ✨ Cute Theme Demo ✨
        </h1>
        <p className="text-lg text-muted-foreground font-cute">
          Welcome to your adorable bookshelf! 🌸
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="card-cute bg-cute-gradient">
          <CardHeader>
            <CardTitle className="font-cute text-2xl flex items-center gap-2">
              <Sparkles className="text-primary" />
              Add New Book
            </CardTitle>
            <CardDescription className="font-cute">
              Share your latest reading adventure! 📚
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-cute">
                Book Title
              </label>
              <Input className="input-cute" placeholder="Enter book title..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-cute">Author</label>
              <Input className="input-cute" placeholder="Who wrote it?" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="cute" size="cute-lg" className="flex-1">
                <Heart className="mr-2" />
                Save Book
              </Button>
              <Button variant="cute-outline" size="cute-lg">
                <Star className="mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-cute bg-cute-gradient">
          <CardHeader>
            <CardTitle className="font-cute text-2xl flex items-center gap-2">
              <Star className="text-accent" />
              Reading Stats
            </CardTitle>
            <CardDescription className="font-cute">
              Your reading journey so far! 📊
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold font-cute text-primary">
                  12
                </div>
                <div className="text-sm font-cute text-muted-foreground">
                  Books Read
                </div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                <div className="text-2xl font-bold font-cute text-secondary">
                  3
                </div>
                <div className="text-sm font-cute text-muted-foreground">
                  Currently Reading
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-cute">Reading Goal</span>
                <span className="font-cute font-semibold">80%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: '80%' }}
                ></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="badge-cute font-cute">
                Fantasy
              </Badge>
              <Badge variant="secondary" className="badge-cute font-cute">
                Romance
              </Badge>
              <Badge variant="secondary" className="badge-cute font-cute">
                Mystery
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold font-cute">Button Variants</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="cute" size="cute-lg">
            <Heart className="mr-2" />
            Primary Cute
          </Button>
          <Button variant="cute-secondary" size="cute-lg">
            <Star className="mr-2" />
            Secondary Cute
          </Button>
          <Button variant="cute-outline" size="cute-lg">
            <Sparkles className="mr-2" />
            Outline Cute
          </Button>
          <Button variant="cute-ghost" size="cute-lg">
            Ghost Cute
          </Button>
        </div>
      </div>
    </div>
  );
}
