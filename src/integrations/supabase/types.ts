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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_configs: {
        Row: {
          api_key: string
          base_url: string | null
          created_at: string | null
          enabled: boolean
          id: string
          model: string | null
          name: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          base_url?: string | null
          created_at?: string | null
          enabled?: boolean
          id?: string
          model?: string | null
          name: string
          provider: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          base_url?: string | null
          created_at?: string | null
          enabled?: boolean
          id?: string
          model?: string | null
          name?: string
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_endpoints: {
        Row: {
          auth_header_name: string | null
          auth_type: string | null
          category: string
          cost_per_request: number | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean | null
          method: string
          path: string
          rate_limit_per_minute: number | null
          requires_auth: boolean | null
          sample_response: Json | null
          tags: string[] | null
          target_method: string | null
          target_url: string | null
          timeout_ms: number | null
          title: string
          updated_at: string
        }
        Insert: {
          auth_header_name?: string | null
          auth_type?: string | null
          category: string
          cost_per_request?: number | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          method: string
          path: string
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          sample_response?: Json | null
          tags?: string[] | null
          target_method?: string | null
          target_url?: string | null
          timeout_ms?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          auth_header_name?: string | null
          auth_type?: string | null
          category?: string
          cost_per_request?: number | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          method?: string
          path?: string
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          sample_response?: Json | null
          tags?: string[] | null
          target_method?: string | null
          target_url?: string | null
          timeout_ms?: number | null
          title?: string
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
          key_prefix: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      api_parameters: {
        Row: {
          created_at: string
          description: string
          endpoint_id: string
          example: Json | null
          id: string
          name: string
          required: boolean
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          endpoint_id: string
          example?: Json | null
          id?: string
          name: string
          required?: boolean
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          endpoint_id?: string
          example?: Json | null
          id?: string
          name?: string
          required?: boolean
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_parameters_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key_id: string
          created_at: string | null
          endpoint_id: string
          id: string
          requests_count: number | null
          window_start: string | null
        }
        Insert: {
          api_key_id: string
          created_at?: string | null
          endpoint_id: string
          id?: string
          requests_count?: number | null
          window_start?: string | null
        }
        Update: {
          api_key_id?: string
          created_at?: string | null
          endpoint_id?: string
          id?: string
          requests_count?: number | null
          window_start?: string | null
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
          created_at: string | null
          endpoint_id: string
          id: string
          is_encrypted: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_name: string
          config_value: string
          created_at?: string | null
          endpoint_id: string
          id?: string
          is_encrypted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_name?: string
          config_value?: string
          created_at?: string | null
          endpoint_id?: string
          id?: string
          is_encrypted?: boolean | null
          updated_at?: string | null
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
          endpoint_path: string | null
          error_message: string | null
          forwarded_to: string | null
          id: string
          method: string | null
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          api_key_id?: string | null
          cost_units?: number | null
          endpoint_path?: string | null
          error_message?: string | null
          forwarded_to?: string | null
          id?: string
          method?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          api_key_id?: string | null
          cost_units?: number | null
          endpoint_path?: string | null
          error_message?: string | null
          forwarded_to?: string | null
          id?: string
          method?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_participants: {
        Row: {
          channel_id: string
          character_id: string
          created_at: string | null
        }
        Insert: {
          channel_id: string
          character_id: string
          created_at?: string | null
        }
        Update: {
          channel_id?: string
          character_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_participants_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_participants_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_direct_message: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_direct_message?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_direct_message?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      character_moods: {
        Row: {
          character_id: string
          created_at: string | null
          id: string
          intensity: number
          name: string
          timestamp: number
        }
        Insert: {
          character_id: string
          created_at?: string | null
          id?: string
          intensity: number
          name: string
          timestamp: number
        }
        Update: {
          character_id?: string
          created_at?: string | null
          id?: string
          intensity?: number
          name?: string
          timestamp?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_moods_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relationships: {
        Row: {
          character_id: string
          created_at: string | null
          id: string
          relationship_type: string
          strength: number
          target_character_id: string
          updated_at: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          id?: string
          relationship_type: string
          strength: number
          target_character_id: string
          updated_at?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          id?: string
          relationship_type?: string
          strength?: number
          target_character_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_target_character_id_fkey"
            columns: ["target_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          avatar: string
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          personality: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          personality?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          personality?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_cents: number
          billing_period_end: string
          billing_period_start: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          plan_name: string
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          plan_name: string
          status: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          plan_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          channel_id: string
          character_id: string
          command: Json | null
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          channel_id: string
          character_id: string
          command?: Json | null
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          channel_id?: string
          character_id?: string
          command?: Json | null
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string
          display_order: number
          feature_text: string
          id: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          feature_text: string
          id?: string
          plan_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          feature_text?: string
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          cta_text: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          period: string
          price_cents: number
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text: string
          description: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          period: string
          price_cents: number
          tier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          period?: string
          price_cents?: number
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
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
          monthly_api_limit: number
          plan_name: string
          plan_tier: string
          price_cents: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          monthly_api_limit: number
          plan_name: string
          plan_tier: string
          price_cents: number
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          monthly_api_limit?: number
          plan_name?: string
          plan_tier?: string
          price_cents?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          api_keys_count: number
          avatar_url: string
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
          monthly_api_limit: number
          plan_tier: string
          role: Database["public"]["Enums"]["app_role"]
          subscription_status: string
          usage_last_30_days: number
          username: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
  public: {
    Enums: {
      app_role: ["sysadmin", "admin", "user"],
    },
  },
} as const
