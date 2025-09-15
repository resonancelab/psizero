import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, Search } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useBlog } from '@/hooks/useBlog';
import { cn } from '@/lib/utils';

export default function Blog() {
  const { posts, categories, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.is_featured);
  const regularPosts = filteredPosts.filter(post => !post.is_featured);

  if (loading) {
    return (
      <PageLayout>
        <Section className="py-16">
          <LoadingSkeleton />
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Latest Updates & Announcements
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Stay informed about the latest developments in quantum computing, platform updates, and industry insights.
          </p>
        </div>
      </Section>

      {/* Filters Section */}
      <Section padding="md">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              size="sm"
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.slug)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Section padding="md">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-api-primary/20">
                <div className="relative overflow-hidden">
                  {post.cover_image_url && (
                    <div className="aspect-video bg-gradient-to-br from-api-primary/10 to-api-secondary/10 flex items-center justify-center">
                      <img 
                        src={post.cover_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-api-primary text-white">
                    Featured
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at).toLocaleDateString()}
                    {post.category_name && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className={post.category_color}>
                          {post.category_name}
                        </Badge>
                      </>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-api-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="group-hover:bg-api-primary group-hover:text-white transition-colors">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Regular Posts */}
      <Section padding="lg">
        <h2 className="text-3xl font-bold mb-8">
          {featuredPosts.length > 0 ? 'Recent Posts' : 'All Posts'}
        </h2>
        {regularPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm || selectedCategory ? 'No posts match your filters.' : 'No blog posts available yet.'}
            </p>
            {(searchTerm || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  {post.cover_image_url && (
                    <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                      <img 
                        src={post.cover_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at).toLocaleDateString()}
                    {post.category_name && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className={post.category_color}>
                          {post.category_name}
                        </Badge>
                      </>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-api-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="group-hover:bg-api-primary group-hover:text-white transition-colors">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}