-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color_class TEXT DEFAULT 'bg-blue-100 text-blue-800',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  author_id UUID NOT NULL,
  category_id UUID,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog categories policies
CREATE POLICY "Everyone can view active blog categories" 
ON public.blog_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Sysadmins can manage blog categories" 
ON public.blog_categories 
FOR ALL 
USING (is_sysadmin());

-- Blog posts policies
CREATE POLICY "Everyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Sysadmins can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (is_sysadmin());

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get published blog posts with category info
CREATE OR REPLACE FUNCTION public.get_published_blog_posts()
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  author_id UUID,
  category_name TEXT,
  category_slug TEXT,
  category_color TEXT,
  tags TEXT[],
  is_featured BOOLEAN,
  cover_image_url TEXT,
  view_count INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.author_id,
    bc.name as category_name,
    bc.slug as category_slug,
    bc.color_class as category_color,
    bp.tags,
    bp.is_featured,
    bp.cover_image_url,
    bp.view_count,
    bp.published_at,
    bp.created_at
  FROM public.blog_posts bp
  LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
  WHERE bp.is_published = true
  ORDER BY bp.is_featured DESC, bp.published_at DESC;
$$;

-- Create function to get blog post by slug
CREATE OR REPLACE FUNCTION public.get_blog_post_by_slug(_slug TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  content TEXT,
  excerpt TEXT,
  author_id UUID,
  category_name TEXT,
  category_slug TEXT,
  tags TEXT[],
  cover_image_url TEXT,
  view_count INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.content,
    bp.excerpt,
    bp.author_id,
    bc.name as category_name,
    bc.slug as category_slug,
    bp.tags,
    bp.cover_image_url,
    bp.view_count,
    bp.published_at,
    bp.created_at
  FROM public.blog_posts bp
  LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
  WHERE bp.slug = _slug AND bp.is_published = true;
$$;