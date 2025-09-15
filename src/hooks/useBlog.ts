import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author_id: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  tags?: string[];
  is_featured?: boolean;
  cover_image_url?: string;
  view_count: number;
  published_at: string;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color_class?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_published_blog_posts');
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching blog categories:', err);
      setError(err.message);
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase.rpc('get_blog_post_by_slug', {
        _slug: slug
      });
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (err: any) {
      console.error('Error fetching blog post:', err);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    error,
    refetch: () => {
      fetchPosts();
      fetchCategories();
    },
    getPostBySlug,
  };
}

export function useAdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(name, slug)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching all blog posts:', err);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching all blog categories:', err);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const createPost = async (postData: any) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      
      await fetchAllPosts();
      return data;
    } catch (err: any) {
      console.error('Error creating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePost = async (id: string, postData: any) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      
      await fetchAllPosts();
      return data;
    } catch (err: any) {
      console.error('Error updating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      await fetchAllPosts();
    } catch (err: any) {
      console.error('Error deleting blog post:', err);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const createCategory = async (categoryData: any) => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      await fetchAllCategories();
      return data;
    } catch (err: any) {
      console.error('Error creating category:', err);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAllPosts();
    fetchAllCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    createPost,
    updatePost,
    deletePost,
    createCategory,
    refetch: () => {
      fetchAllPosts();
      fetchAllCategories();
    },
  };
}