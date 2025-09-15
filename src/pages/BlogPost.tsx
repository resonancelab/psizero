import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Eye } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useBlog, type BlogPost } from '@/hooks/useBlog';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug } = useBlog();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No post slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
        
        if (!postData) {
          setError('Post not found');
        } else {
          setPost({ ...postData, is_featured: postData.is_featured || false });
        }
      } catch (err: any) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, getPostBySlug]);

  if (loading) {
    return (
      <PageLayout>
        <Section className="py-16">
          <LoadingSkeleton />
        </Section>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <Section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {error === 'Post not found' ? 'Post Not Found' : 'Error Loading Post'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error === 'Post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
                : 'There was an error loading the blog post. Please try again later.'
              }
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-gradient-to-br from-api-primary/10 to-api-secondary/10">
              <img 
                src={post.cover_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            {post.view_count > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.view_count} views
              </div>
            )}

            {post.category_name && (
              <Badge variant="secondary" className={post.category_color}>
                {post.category_name}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Content */}
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            {post.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose prose-lg prose-slate max-w-none
                          prose-headings:text-foreground 
                          prose-p:text-muted-foreground 
                          prose-strong:text-foreground
                          prose-code:text-api-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
                          prose-pre:bg-muted prose-pre:border
                          prose-blockquote:border-l-api-primary prose-blockquote:text-muted-foreground
                          prose-a:text-api-primary prose-a:no-underline hover:prose-a:underline"
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                This post doesn't have any content yet.
              </p>
            )}
          </article>

          {/* Back to Blog Footer */}
          <div className="mt-12 pt-8 border-t">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Posts
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}