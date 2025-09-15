-- Create tutorial categories table
CREATE TABLE public.tutorial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT, -- Lucide icon name
  color_class TEXT, -- CSS class for theming
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT, -- Markdown content
  excerpt TEXT, -- Short summary for listings
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_time INTEGER, -- in minutes
  category_id UUID REFERENCES public.tutorial_categories(id) ON DELETE SET NULL,
  tags TEXT[], -- Array of tags
  prerequisites TEXT[], -- Array of prerequisite tutorial slugs
  learning_objectives TEXT[], -- What users will learn
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create tutorial steps table for multi-step tutorials
CREATE TABLE public.tutorial_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_id UUID REFERENCES public.tutorials(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content for this step
  code_example TEXT, -- Optional code example
  expected_output TEXT, -- What users should see
  tips TEXT[], -- Helpful tips for this step
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tutorial_id, step_number)
);

-- Create tutorial user progress table
CREATE TABLE public.tutorial_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tutorial_id UUID REFERENCES public.tutorials(id) ON DELETE CASCADE NOT NULL,
  completed_steps INTEGER[] DEFAULT '{}', -- Array of completed step numbers
  is_completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, tutorial_id)
);

-- Enable RLS on all tables
ALTER TABLE public.tutorial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutorial_categories
CREATE POLICY "Everyone can view active tutorial categories" ON public.tutorial_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sysadmins can manage tutorial categories" ON public.tutorial_categories
  FOR ALL USING (public.is_sysadmin());

-- RLS Policies for tutorials
CREATE POLICY "Everyone can view published tutorials" ON public.tutorials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Sysadmins can manage all tutorials" ON public.tutorials
  FOR ALL USING (public.is_sysadmin());

-- RLS Policies for tutorial_steps  
CREATE POLICY "Everyone can view steps for published tutorials" ON public.tutorial_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tutorials 
      WHERE id = tutorial_steps.tutorial_id AND is_published = true
    )
  );

CREATE POLICY "Sysadmins can manage all tutorial steps" ON public.tutorial_steps
  FOR ALL USING (public.is_sysadmin());

-- RLS Policies for tutorial_progress
CREATE POLICY "Users can view their own progress" ON public.tutorial_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" ON public.tutorial_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.tutorial_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sysadmins can view all tutorial progress" ON public.tutorial_progress
  FOR SELECT USING (public.is_sysadmin());

-- Add triggers for updated_at
CREATE TRIGGER update_tutorial_categories_updated_at 
  BEFORE UPDATE ON public.tutorial_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at 
  BEFORE UPDATE ON public.tutorials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutorial_steps_updated_at 
  BEFORE UPDATE ON public.tutorial_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tutorial categories
INSERT INTO public.tutorial_categories (name, slug, description, icon_name, color_class, display_order) VALUES
('Getting Started', 'getting-started', 'Learn the basics and setup', 'Rocket', 'text-green-600', 1),
('API Integration', 'api-integration', 'Connect to our APIs', 'Plug', 'text-blue-600', 2),
('Authentication', 'authentication', 'Secure your applications', 'Shield', 'text-purple-600', 3),
('Advanced Features', 'advanced-features', 'Deep dive into complex topics', 'Zap', 'text-orange-600', 4),
('Best Practices', 'best-practices', 'Industry standards and tips', 'Award', 'text-indigo-600', 5);

-- Function to get published tutorials with category info
CREATE OR REPLACE FUNCTION public.get_published_tutorials()
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  excerpt TEXT,
  difficulty TEXT,
  estimated_time INTEGER,
  category_name TEXT,
  category_slug TEXT,
  category_icon TEXT,
  category_color TEXT,
  tags TEXT[],
  cover_image_url TEXT,
  is_featured BOOLEAN,
  view_count INTEGER,
  likes_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.title,
    t.slug,
    t.description,
    t.excerpt,
    t.difficulty,
    t.estimated_time,
    tc.name as category_name,
    tc.slug as category_slug,
    tc.icon_name as category_icon,
    tc.color_class as category_color,
    t.tags,
    t.cover_image_url,
    t.is_featured,
    t.view_count,
    t.likes_count,
    t.created_at,
    t.published_at
  FROM public.tutorials t
  LEFT JOIN public.tutorial_categories tc ON t.category_id = tc.id
  WHERE t.is_published = true
  ORDER BY t.is_featured DESC, t.published_at DESC;
$$;

-- Function to get tutorial by slug with steps
CREATE OR REPLACE FUNCTION public.get_tutorial_by_slug(_slug TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  difficulty TEXT,
  estimated_time INTEGER,
  category_name TEXT,
  category_slug TEXT,
  tags TEXT[],
  prerequisites TEXT[],
  learning_objectives TEXT[],
  cover_image_url TEXT,
  view_count INTEGER,
  likes_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  steps JSONB
)
LANGUAGE SQL
SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.title,
    t.slug,
    t.description,
    t.content,
    t.difficulty,
    t.estimated_time,
    tc.name as category_name,
    tc.slug as category_slug,
    t.tags,
    t.prerequisites,
    t.learning_objectives,
    t.cover_image_url,
    t.view_count,
    t.likes_count,
    t.created_at,
    t.published_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', ts.id,
          'step_number', ts.step_number,
          'title', ts.title,
          'content', ts.content,
          'code_example', ts.code_example,
          'expected_output', ts.expected_output,
          'tips', ts.tips
        ) ORDER BY ts.step_number
      ) FILTER (WHERE ts.id IS NOT NULL),
      '[]'::jsonb
    ) as steps
  FROM public.tutorials t
  LEFT JOIN public.tutorial_categories tc ON t.category_id = tc.id
  LEFT JOIN public.tutorial_steps ts ON t.id = ts.tutorial_id
  WHERE t.slug = _slug AND t.is_published = true
  GROUP BY t.id, tc.name, tc.slug;
$$;