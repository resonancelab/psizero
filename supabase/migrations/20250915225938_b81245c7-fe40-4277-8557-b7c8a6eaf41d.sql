-- Drop and recreate function with correct return type
DROP FUNCTION public.get_blog_post_by_slug(text);

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
    bp.content,
    bp.excerpt,
    bp.author_id,
    bc.name as category_name,
    bc.slug as category_slug,
    bp.tags,
    bp.is_featured,
    bp.cover_image_url,
    bp.view_count,
    bp.published_at,
    bp.created_at
  FROM public.blog_posts bp
  LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
  WHERE bp.slug = _slug AND bp.is_published = true;
$$;