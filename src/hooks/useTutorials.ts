import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface TutorialCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color_class?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  excerpt?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time?: number;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  category_color?: string;
  tags?: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  cover_image_url?: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  likes_count: number;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  steps?: TutorialStep[];
}

export interface TutorialStep {
  id: string;
  tutorial_id: string;
  step_number: number;
  title: string;
  content?: string;
  code_example?: string;
  expected_output?: string;
  tips?: string[];
  created_at: string;
  updated_at: string;
}

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<TutorialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPublishedTutorials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_published_tutorials');
      
      if (error) throw error;
      
      // Type the response data properly
      const tutorialData = (data || []).map(tutorial => ({
        ...tutorial,
        difficulty: tutorial.difficulty as 'beginner' | 'intermediate' | 'advanced',
        is_published: true, // Since we're only getting published tutorials
        is_featured: tutorial.is_featured || false
      }));
      
      setTutorials(tutorialData);
    } catch (error: any) {
      console.error('Error fetching tutorials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorial categories",
        variant: "destructive",
      });
    }
  };

  const getTutorialBySlug = async (slug: string): Promise<Tutorial | null> => {
    try {
      const { data, error } = await supabase.rpc('get_tutorial_by_slug', {
        _slug: slug
      });
      
      if (error) throw error;
      
      const tutorialData = data && data.length > 0 ? {
        ...data[0],
        difficulty: data[0].difficulty as 'beginner' | 'intermediate' | 'advanced',
        is_published: true,
        is_featured: false, // Default since not in function response
        steps: []  // Will be properly typed from the steps JSONB field
      } : null;
      
      return tutorialData;
    } catch (error: any) {
      console.error('Error fetching tutorial:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorial",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateViewCount = async (tutorialId: string) => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('view_count')
        .eq('id', tutorialId)
        .single();
        
      if (!error && data) {
        await supabase
          .from('tutorials')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', tutorialId);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  useEffect(() => {
    fetchPublishedTutorials();
    fetchCategories();
  }, []);

  return {
    tutorials,
    categories,
    isLoading,
    fetchPublishedTutorials,
    fetchCategories,
    getTutorialBySlug,
    updateViewCount,
  };
};

// Admin hook for managing tutorials
export const useAdminTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<TutorialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllTutorials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tutorials')
        .select(`
          *,
          tutorial_categories(name, slug, icon_name, color_class)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Type the response data properly
      const adminTutorials = (data || []).map(tutorial => ({
        ...tutorial,
        difficulty: tutorial.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category_name: tutorial.tutorial_categories?.name,
        category_slug: tutorial.tutorial_categories?.slug,
        category_icon: tutorial.tutorial_categories?.icon_name,
        category_color: tutorial.tutorial_categories?.color_class,
      }));
      
      setTutorials(adminTutorials);
    } catch (error: any) {
      console.error('Error fetching admin tutorials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const createTutorial = async (tutorial: Omit<Tutorial, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'likes_count'>) => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .insert(tutorial)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutorial created successfully",
      });

      fetchAllTutorials(); // Refresh data
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating tutorial:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tutorial",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTutorial = async (id: string, updates: Partial<Tutorial>) => {
    try {
      const { error } = await supabase
        .from('tutorials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutorial updated successfully",
      });

      fetchAllTutorials(); // Refresh data
      return { success: true };
    } catch (error: any) {
      console.error('Error updating tutorial:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tutorial",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutorial deleted successfully",
      });

      fetchAllTutorials(); // Refresh data
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tutorial",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const createCategory = async (category: Omit<TutorialCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tutorial_categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success", 
        description: "Category created successfully",
      });

      fetchAllCategories(); // Refresh data
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateCategory = async (id: string, updates: Partial<TutorialCategory>) => {
    try {
      const { error } = await supabase
        .from('tutorial_categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      fetchAllCategories(); // Refresh data
      return { success: true };
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAllTutorials();
    fetchAllCategories();
  }, []);

  return {
    tutorials,
    categories,
    isLoading,
    fetchAllTutorials,
    fetchAllCategories,
    createTutorial,
    updateTutorial,
    deleteTutorial,
    createCategory,
    updateCategory,
  };
};