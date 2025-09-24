import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlaygroundExample, PlaygroundFilters, CreatePlaygroundExampleInput, UpdatePlaygroundExampleInput } from '@/types/playground';
import { useToast } from '@/hooks/use-toast';

export function usePlaygroundExamples(filters?: PlaygroundFilters) {
  const [examples, setExamples] = useState<PlaygroundExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExamples = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('playground_examples')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.service) {
        query = query.eq('service', filters.service);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform snake_case to camelCase
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        service: item.service as PlaygroundExample['service'],
        category: item.category as PlaygroundExample['category'],
        difficulty: item.difficulty as PlaygroundExample['difficulty'],
        estimatedTime: item.estimated_time,
        tags: item.tags || [],
        codeSnippet: item.code_snippet,
        fullCode: item.full_code,
        liveDemo: item.live_demo || false,
        featured: item.featured || false,
        isActive: item.is_active || true,
        viewCount: item.view_count || 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        createdBy: item.created_by
      }));

      setExamples(transformedData);
    } catch (err) {
      console.error('Error fetching playground examples:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch examples');
      toast({
        title: 'Error',
        description: 'Failed to load playground examples',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const createExample = async (input: CreatePlaygroundExampleInput) => {
    try {
      const { data, error } = await supabase
        .from('playground_examples')
        .insert({
          title: input.title,
          description: input.description,
          service: input.service,
          category: input.category,
          difficulty: input.difficulty,
          estimated_time: input.estimatedTime,
          tags: input.tags,
          code_snippet: input.codeSnippet,
          full_code: input.fullCode,
          live_demo: input.liveDemo || false,
          featured: input.featured || false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Playground example created successfully'
      });

      await fetchExamples();
      return data;
    } catch (err) {
      console.error('Error creating playground example:', err);
      toast({
        title: 'Error',
        description: 'Failed to create playground example',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateExample = async (id: string, input: UpdatePlaygroundExampleInput) => {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.service !== undefined) updateData.service = input.service;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
      if (input.estimatedTime !== undefined) updateData.estimated_time = input.estimatedTime;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.codeSnippet !== undefined) updateData.code_snippet = input.codeSnippet;
      if (input.fullCode !== undefined) updateData.full_code = input.fullCode;
      if (input.liveDemo !== undefined) updateData.live_demo = input.liveDemo;
      if (input.featured !== undefined) updateData.featured = input.featured;
      if (input.isActive !== undefined) updateData.is_active = input.isActive;

      const { data, error } = await supabase
        .from('playground_examples')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Playground example updated successfully'
      });

      await fetchExamples();
      return data;
    } catch (err) {
      console.error('Error updating playground example:', err);
      toast({
        title: 'Error',
        description: 'Failed to update playground example',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteExample = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playground_examples')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Playground example deleted successfully'
      });

      await fetchExamples();
    } catch (err) {
      console.error('Error deleting playground example:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete playground example',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      // First get the current view count
      const { data: current } = await supabase
        .from('playground_examples')
        .select('view_count')
        .eq('id', id)
        .single();

      if (current) {
        // Then increment it
        await supabase
          .from('playground_examples')
          .update({ view_count: (current.view_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, [fetchExamples]);

  return {
    examples,
    loading,
    error,
    createExample,
    updateExample,
    deleteExample,
    incrementViewCount,
    refetch: fetchExamples
  };
}

export function useFeaturedExamples() {
  const [examples, setExamples] = useState<PlaygroundExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('featured_playground_examples')
          .select('*');

        if (fetchError) throw fetchError;

        // Transform snake_case to camelCase
        const transformedData = (data || []).map(item => ({
          id: item.id!,
          title: item.title!,
          description: item.description!,
          service: item.service! as PlaygroundExample['service'],
          category: item.category! as PlaygroundExample['category'],
          difficulty: item.difficulty! as PlaygroundExample['difficulty'],
          estimatedTime: item.estimated_time!,
          tags: item.tags || [],
          codeSnippet: item.code_snippet,
          fullCode: item.full_code,
          liveDemo: item.live_demo || false,
          featured: item.featured || false,
          isActive: item.is_active || true,
          viewCount: item.view_count || 0,
          createdAt: item.created_at!,
          updatedAt: item.updated_at!,
          createdBy: item.created_by
        }));

        setExamples(transformedData);
      } catch (err) {
        console.error('Error fetching featured examples:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch featured examples');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { examples, loading, error };
}