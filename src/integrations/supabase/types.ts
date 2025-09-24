export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_endpoints: {
        Row: {
          auth_header_name: string | null
          auth_type: string | null
          cost_per_request: number | null
          created_at: string
          id: string
          is_active: boolean | null
          method: string
          path: string
          rate_limit_per_minute: number | null
          requires_auth: boolean | null
          target_method: string
          target_url: string
          timeout_ms: number | null
          updated_at: string
        }
        Insert: {
          auth_header_name?: string | null
          auth_type?: string | null
          cost_per_request?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          method: string
          path: string
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          target_method: string
          target_url: string
          timeout_ms?: number | null
          updated_at?: string
        }
        Update: {
          auth_header_name?: string | null
          auth_type?: string | null
          cost_per_request?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          method?: string
          path?: string
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          target_method?: string
          target_url?: string
          timeout_ms?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used_at: string | null
          name: string
          organization_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used_at?: string | null
          name: string
          organization_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint_id: string
          id: string
          requests_count: number | null
          window_start: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint_id: string
          id?: string
          requests_count?: number | null
          window_start: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint_id?: string
          id?: string
          requests_count?: number | null
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_rate_limits_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      api_target_configs: {
        Row: {
          config_name: string
          config_value: string
          created_at: string
          endpoint_id: string
          id: string
          is_encrypted: boolean | null
        }
        Insert: {
          config_name: string
          config_value: string
          created_at?: string
          endpoint_id: string
          id?: string
          is_encrypted?: boolean | null
        }
        Update: {
          config_name?: string
          config_value?: string
          created_at?: string
          endpoint_id?: string
          id?: string
          is_encrypted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "api_target_configs_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          api_key_id: string | null
          cost_units: number | null
          endpoint_path: string
          error_message: string | null
          forwarded_to: string | null
          id: string
          method: string
          organization_id: string | null
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number
          status_code: number
          timestamp: string
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          cost_units?: number | null
          endpoint_path: string
          error_message?: string | null
          forwarded_to?: string | null
          id?: string
          method: string
          organization_id?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms: number
          status_code: number
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          cost_units?: number | null
          endpoint_path?: string
          error_message?: string | null
          forwarded_to?: string | null
          id?: string
          method?: string
          organization_id?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number
          status_code?: number
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          color_class: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color_class?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      playground_examples: {
        Row: {
          category: string
          code_snippet: string | null
          created_at: string
          created_by: string | null
          description: string
          difficulty: string
          estimated_time: string
          featured: boolean | null
          full_code: string | null
          id: string
          is_active: boolean | null
          live_demo: boolean | null
          service: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          code_snippet?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          difficulty: string
          estimated_time: string
          featured?: boolean | null
          full_code?: string | null
          id?: string
          is_active?: boolean | null
          live_demo?: boolean | null
          service: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          code_snippet?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          difficulty?: string
          estimated_time?: string
          featured?: boolean | null
          full_code?: string | null
          id?: string
          is_active?: boolean | null
          live_demo?: boolean | null
          service?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          is_sysadmin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_sysadmin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_sysadmin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          api_calls_limit: number | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
          rate_limit_per_minute: number | null
          updated_at: string
        }
        Insert: {
          api_calls_limit?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string
        }
        Update: {
          api_calls_limit?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      tutorial_categories: {
        Row: {
          color_class: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tutorial_progress: {
        Row: {
          completed_steps: number[] | null
          completion_date: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          tutorial_id: string
          user_id: string
        }
        Insert: {
          completed_steps?: number[] | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          tutorial_id: string
          user_id: string
        }
        Update: {
          completed_steps?: number[] | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          tutorial_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_progress_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorial_steps: {
        Row: {
          code_example: string | null
          content: string | null
          created_at: string | null
          expected_output: string | null
          id: string
          step_number: number
          tips: string[] | null
          title: string
          tutorial_id: string
          updated_at: string | null
        }
        Insert: {
          code_example?: string | null
          content?: string | null
          created_at?: string | null
          expected_output?: string | null
          id?: string
          step_number: number
          tips?: string[] | null
          title: string
          tutorial_id: string
          updated_at?: string | null
        }
        Update: {
          code_example?: string | null
          content?: string | null
          created_at?: string | null
          expected_output?: string | null
          id?: string
          step_number?: number
          tips?: string[] | null
          title?: string
          tutorial_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_steps_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorials: {
        Row: {
          category_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_time: number | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          learning_objectives: string[] | null
          likes_count: number | null
          prerequisites: string[] | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          likes_count?: number | null
          prerequisites?: string[] | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          likes_count?: number | null
          prerequisites?: string[] | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tutorials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tutorial_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          organization_id: string | null
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          organization_id?: string | null
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          organization_id?: string | null
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      featured_playground_examples: {
        Row: {
          category: string | null
          code_snippet: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          estimated_time: string | null
          featured: boolean | null
          full_code: string | null
          id: string | null
          is_active: boolean | null
          live_demo: boolean | null
          service: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          code_snippet?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          featured?: boolean | null
          full_code?: string | null
          id?: string | null
          is_active?: boolean | null
          live_demo?: boolean | null
          service?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          code_snippet?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          featured?: boolean | null
          full_code?: string | null
          id?: string | null
          is_active?: boolean | null
          live_demo?: boolean | null
          service?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_organization_membership: {
        Args: { _org_id: string; _user_id?: string }
        Returns: boolean
      }
      check_organization_ownership: {
        Args: { _org_id: string; _user_id?: string }
        Returns: boolean
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          roles: string[]
        }[]
      }
      get_blog_post_by_slug: {
        Args: { _slug: string }
        Returns: {
          author_id: string
          category_name: string
          category_slug: string
          content: string
          cover_image_url: string
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          published_at: string
          slug: string
          tags: string[]
          title: string
          view_count: number
        }[]
      }
      get_published_blog_posts: {
        Args: Record<PropertyKey, never>
        Returns: {
          author_id: string
          category_color: string
          category_name: string
          category_slug: string
          cover_image_url: string
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          published_at: string
          slug: string
          tags: string[]
          title: string
          view_count: number
        }[]
      }
      get_published_tutorials: {
        Args: Record<PropertyKey, never>
        Returns: {
          category_color: string
          category_icon: string
          category_name: string
          category_slug: string
          cover_image_url: string
          created_at: string
          description: string
          difficulty: string
          estimated_time: number
          excerpt: string
          id: string
          is_featured: boolean
          likes_count: number
          published_at: string
          slug: string
          tags: string[]
          title: string
          view_count: number
        }[]
      }
      get_tutorial_by_slug: {
        Args: { _slug: string }
        Returns: {
          category_name: string
          category_slug: string
          content: string
          cover_image_url: string
          created_at: string
          description: string
          difficulty: string
          estimated_time: number
          id: string
          learning_objectives: string[]
          likes_count: number
          prerequisites: string[]
          published_at: string
          slug: string
          steps: Json
          tags: string[]
          title: string
          view_count: number
        }[]
      }
      get_user_organizations: {
        Args: { _user_id?: string }
        Returns: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          logo_url: string
          name: string
          role: string
          slug: string
        }[]
      }
      get_user_role_safe: {
        Args: { _user_id?: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_sysadmin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "sysadmin" | "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["sysadmin", "admin", "user"],
    },
  },
} as const
