import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import psiZeroApi from '@/lib/api/index';
import type { ApiResponse } from '@/lib/api/types';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  summary?: string;
  author_id: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_id?: string;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  cover_image_url?: string;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at?: string;
  status?: string;
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

interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  total_pages: number;
}

interface AdminBlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  status: string;
  tags: string[];
  category_id?: string;
  author_id: string;
  is_featured?: boolean;
  is_published?: boolean;
  cover_image_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  blog_categories?: {
    name: string;
    slug: string;
  };
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
      const response = await psiZeroApi.client.get<BlogPostsResponse>('/v1/content/blog');
      
      if (response.data) {
        setPosts(response.data.posts || []);
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching blog posts:', err);
      setError(errorMessage);
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
      const response = await psiZeroApi.client.get<BlogCategory[]>('/v1/content/blog/categories');
      
      if (response.data) {
        setCategories(response.data || []);
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching blog categories:', err);
      setError(errorMessage);
    }
  };

  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const response = await psiZeroApi.client.get<BlogPost>(`/v1/content/blog/${slug}`);
      
      return response.data || null;
    } catch (err: Error | unknown) {
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

interface CreateBlogPostRequest {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  category_id?: string;
  is_featured?: boolean;
  is_published?: boolean;
  cover_image_url?: string;
}

interface UpdateBlogPostRequest {
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
  category_id?: string;
  is_featured?: boolean;
  is_published?: boolean;
  cover_image_url?: string;
}

interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  color_class?: string;
  display_order?: number;
  is_active?: boolean;
}

export function useAdminBlog() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await psiZeroApi.client.get<{
        posts: AdminBlogPost[];
        total: number;
        page: number;
        total_pages: number;
      }>('/v1/admin/content/blog-posts');
      
      if (response.data) {
        setPosts(response.data.posts || []);
      }
    } catch (err: Error | unknown) {
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
      const response = await psiZeroApi.client.get<BlogCategory[]>('/v1/content/blog/categories');
      
      if (response.data) {
        setCategories(response.data || []);
      }
    } catch (err: Error | unknown) {
      console.error('Error fetching all blog categories:', err);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const createPost = async (postData: CreateBlogPostRequest): Promise<AdminBlogPost> => {
    try {
      const response = await psiZeroApi.client.post<AdminBlogPost>('/v1/admin/content/blog-posts', postData);
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      
      await fetchAllPosts();
      return response.data;
    } catch (err: Error | unknown) {
      console.error('Error creating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePost = async (id: string, postData: UpdateBlogPostRequest): Promise<AdminBlogPost> => {
    try {
      const response = await psiZeroApi.client.put<AdminBlogPost>(`/v1/admin/content/blog-posts/${id}`, postData);
      
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      
      await fetchAllPosts();
      return response.data;
    } catch (err: Error | unknown) {
      console.error('Error updating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePost = async (id: string): Promise<void> => {
    try {
      await psiZeroApi.client.delete(`/v1/admin/content/blog-posts/${id}`);
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      await fetchAllPosts();
    } catch (err: Error | unknown) {
      console.error('Error deleting blog post:', err);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const publishPost = async (id: string): Promise<AdminBlogPost> => {
    try {
      const response = await psiZeroApi.client.post<AdminBlogPost>(`/v1/admin/content/blog-posts/${id}/publish`);
      
      toast({
        title: "Success",
        description: "Blog post published successfully",
      });
      
      await fetchAllPosts();
      return response.data;
    } catch (err: Error | unknown) {
      console.error('Error publishing blog post:', err);
      toast({
        title: "Error",
        description: "Failed to publish blog post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const createCategory = async (categoryData: CreateCategoryRequest): Promise<BlogCategory> => {
    try {
      // Note: This endpoint may need to be implemented in the Go backend
      const response = await psiZeroApi.client.post<BlogCategory>('/v1/admin/content/categories', categoryData);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      await fetchAllCategories();
      return response.data;
    } catch (err: Error | unknown) {
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
    publishPost,
    createCategory,
    refetch: () => {
      fetchAllPosts();
      fetchAllCategories();
    },
  };
}