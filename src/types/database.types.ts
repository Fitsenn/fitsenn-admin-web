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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          code: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          name: string
          permissions: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          roles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          roles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          roles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      force_update_configs: {
        Row: {
          app_name: string
          banned_android_build_numbers: number[]
          banned_ios_build_numbers: number[]
          bundle_id: string
          created_at: string | null
          id: string
          min_android_build_number: number
          min_ios_build_number: number
          store_android_url: string
          store_ios_url: string
          updated_at: string | null
        }
        Insert: {
          app_name: string
          banned_android_build_numbers?: number[]
          banned_ios_build_numbers?: number[]
          bundle_id: string
          created_at?: string | null
          id?: string
          min_android_build_number?: number
          min_ios_build_number?: number
          store_android_url?: string
          store_ios_url?: string
          updated_at?: string | null
        }
        Update: {
          app_name?: string
          banned_android_build_numbers?: number[]
          banned_ios_build_numbers?: number[]
          bundle_id?: string
          created_at?: string | null
          id?: string
          min_android_build_number?: number
          min_ios_build_number?: number
          store_android_url?: string
          store_ios_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          operating_hours: Json | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          operating_hours?: Json | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          operating_hours?: Json | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_discounts: {
        Row: {
          company_id: string
          created_at: string
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          name: string
          plan_id: string | null
          starts_at: string | null
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          discount_type: string
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          plan_id?: string | null
          starts_at?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          plan_id?: string | null
          starts_at?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_discounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_discounts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_infractions: {
        Row: {
          created_at: string | null
          id: string
          membership_id: string
          occurred_at: string
          private_note: string | null
          related_booking_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          membership_id: string
          occurred_at: string
          private_note?: string | null
          related_booking_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          membership_id?: string
          occurred_at?: string
          private_note?: string | null
          related_booking_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_infractions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plan_penalties: {
        Row: {
          ban_days: number
          created_at: string
          id: string
          plan_id: string
          trigger_count: number
          trigger_type: string
          trigger_window_days: number
        }
        Insert: {
          ban_days: number
          created_at?: string
          id?: string
          plan_id: string
          trigger_count: number
          trigger_type: string
          trigger_window_days: number
        }
        Update: {
          ban_days?: number
          created_at?: string
          id?: string
          plan_id?: string
          trigger_count?: number
          trigger_type?: string
          trigger_window_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "membership_plan_penalties_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          company_id: string
          compare_price: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          duration: number
          duration_unit: string
          id: string
          is_active: boolean
          location_id: string | null
          max_freeze_count: number | null
          max_freeze_days: number | null
          name: string
          price: number
          sessions_count: number | null
          tiers: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          compare_price?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duration: number
          duration_unit?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          max_freeze_count?: number | null
          max_freeze_days?: number | null
          name: string
          price: number
          sessions_count?: number | null
          tiers?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          compare_price?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duration?: number
          duration_unit?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          max_freeze_count?: number | null
          max_freeze_days?: number | null
          name?: string
          price?: number
          sessions_count?: number | null
          tiers?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plans_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      super_admins: {
        Row: {
          id: string
          user_id: string
        }
        Insert: {
          id?: string
          user_id: string
        }
        Update: {
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      terms_acceptances: {
        Row: {
          accepted_at: string
          id: string
          terms_id: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          terms_id: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          terms_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_acceptances_terms_id_fkey"
            columns: ["terms_id"]
            isOneToOne: false
            referencedRelation: "terms_and_conditions"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_and_conditions: {
        Row: {
          company_id: string | null
          content: string
          created_at: string | null
          id: string
          published_at: string
          title: string
          version: number
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          published_at?: string
          title: string
          version?: number
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "terms_and_conditions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_encryption_metadata: {
        Row: {
          created_at: string
          id: string
          key_version: number
          salt: string
          updated_at: string
          user_id: string
          verification_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_version?: number
          salt: string
          updated_at?: string
          user_id: string
          verification_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          key_version?: number
          salt?: string
          updated_at?: string
          user_id?: string
          verification_hash?: string
        }
        Relationships: []
      }
      user_membership_bans: {
        Row: {
          created_at: string | null
          ends_at: string
          id: string
          membership_id: string
          private_note: string | null
          public_note: string | null
          reason: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          id?: string
          membership_id: string
          private_note?: string | null
          public_note?: string | null
          reason: string
          started_at: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          id?: string
          membership_id?: string
          private_note?: string | null
          public_note?: string | null
          reason?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_bans_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      user_membership_freezes: {
        Row: {
          created_at: string | null
          duration_days: number
          ended_at: string
          id: string
          membership_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_days: number
          ended_at: string
          id?: string
          membership_id: string
          started_at: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          ended_at?: string
          id?: string
          membership_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_freezes_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memberships: {
        Row: {
          auto_renew: boolean
          company_id: string
          created_at: string | null
          discount_id: string | null
          ends_at: string
          id: string
          plan_id: string
          price_paid: number
          sessions_remaining: number | null
          starts_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          company_id: string
          created_at?: string | null
          discount_id?: string | null
          ends_at: string
          id?: string
          plan_id: string
          price_paid: number
          sessions_remaining?: number | null
          starts_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          company_id?: string
          created_at?: string | null
          discount_id?: string | null
          ends_at?: string
          id?: string
          plan_id?: string
          price_paid?: number
          sessions_remaining?: number | null
          starts_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_terms: { Args: { p_terms_id: string }; Returns: undefined }
      cancel_booking: { Args: { p_booking_id: string }; Returns: Json }
      cancel_freeze: { Args: { p_membership_id: string }; Returns: Json }
      check_company_code_available: {
        Args: { p_code: string; p_exclude_company_id?: string }
        Returns: boolean
      }
      check_in: { Args: { p_booking_id: string }; Returns: Json }
      check_location_dependencies: {
        Args: { p_location_id: string }
        Returns: {
          active_memberships_count: number
          active_plans_count: number
          has_active_memberships: boolean
          has_active_plans: boolean
        }[]
      }
      check_terms_status: {
        Args: never
        Returns: {
          accepted_version: number
          company_id: string
          company_name: string
          content: string
          terms_id: string
          terms_type: string
          title: string
          version: number
        }[]
      }
      create_location: {
        Args: {
          p_address?: string
          p_company_id: string
          p_is_active?: boolean
          p_name: string
          p_operating_hours?: Json
          p_tier?: string
        }
        Returns: string
      }
      get_company_locations: {
        Args: { p_active_only?: boolean; p_company_id: string }
        Returns: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          operating_hours: Json
          tier: string
          updated_at: string
        }[]
      }
      get_company_members: { Args: { company_id: string }; Returns: Json[] }
      get_company_membership_plans: {
        Args: { p_company_id: string }
        Returns: Json
      }
      get_company_users: { Args: { p_company_id: string }; Returns: Json[] }
      get_user_companies: {
        Args: never
        Returns: {
          code: string
          id: string
          logo_url: string
          name: string
        }[]
      }
      get_user_memberships:
        | {
            Args: never
            Returns: {
              ban_ends_at: string
              ends_at: string
              freeze_count_used: number
              freeze_days_used: number
              grace_period_days: number
              id: string
              is_banned: boolean
              is_frozen: boolean
              location_id: string
              location_name: string
              max_freeze_count: number
              max_freeze_days: number
              plan_name: string
              plan_type: string
              sessions_remaining: number
              starts_at: string
              status: string
              tiers: string[]
            }[]
          }
        | {
            Args: { p_company_id: string }
            Returns: {
              ban_ends_at: string
              ends_at: string
              freeze_count_used: number
              freeze_days_used: number
              grace_period_days: number
              id: string
              is_banned: boolean
              is_frozen: boolean
              location_id: string
              location_name: string
              max_freeze_count: number
              max_freeze_days: number
              plan_name: string
              plan_type: string
              sessions_remaining: number
              starts_at: string
              status: string
              tiers: string[]
            }[]
          }
      get_user_permissions: { Args: { p_company_id: string }; Returns: Json }
      invite_existing_user_to_company: {
        Args: { p_company_id: string; p_email: string; p_role_names?: string[] }
        Returns: Json
      }
      join_class: {
        Args: { p_class_id: string; p_membership_id: string }
        Returns: Json
      }
      mark_no_show: {
        Args: { p_booking_id: string; p_private_note?: string }
        Returns: Json
      }
      start_freeze: {
        Args: { p_duration_days: number; p_membership_id: string }
        Returns: Json
      }
      toggle_location_status: {
        Args: { p_is_active: boolean; p_location_id: string }
        Returns: boolean
      }
      update_company_settings: {
        Args: {
          p_code: string
          p_company_id: string
          p_logo_url?: string
          p_name: string
        }
        Returns: boolean
      }
      update_location: {
        Args: {
          p_address?: string
          p_is_active?: boolean
          p_location_id: string
          p_name: string
          p_operating_hours?: Json
          p_tier?: string
        }
        Returns: boolean
      }
      update_profile: {
        Args: {
          p_avatar_url?: string
          p_first_name?: string
          p_last_name?: string
          p_phone?: string
        }
        Returns: Json
      }
      user_belongs_to_company: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      user_has_admin_role: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: boolean
      }
      user_is_company_admin: {
        Args: { p_company_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
