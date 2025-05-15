export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          consultation_date: string
          created_at: string
          end_time: string
          expert_id: string
          id: string
          notes: string | null
          start_time: string
          status: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_date: string
          created_at?: string
          end_time: string
          expert_id: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_date?: string
          created_at?: string
          end_time?: string
          expert_id?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crop_diagnostics: {
        Row: {
          confidence: number | null
          created_at: string
          description: string | null
          disease_name: string | null
          id: string
          image_url: string
          recommendations: Json | null
          severity: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          description?: string | null
          disease_name?: string | null
          id?: string
          image_url: string
          recommendations?: Json | null
          severity?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          description?: string | null
          disease_name?: string | null
          id?: string
          image_url?: string
          recommendations?: Json | null
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      disease_outbreaks: {
        Row: {
          created_at: string
          disease_name: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          radius_km: number
          reported_by: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          disease_name: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          radius_km?: number
          reported_by: string
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          disease_name?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          radius_km?: number
          reported_by?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location?: string
          name?: string
          owner_id?: string
          price_per_day?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_bookings: {
        Row: {
          booking_date: string
          created_at: string
          end_time: string
          equipment_id: string
          id: string
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          end_time: string
          equipment_id: string
          id?: string
          start_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          end_time?: string
          equipment_id?: string
          id?: string
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_solution: boolean | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      market_listings: {
        Row: {
          contact_info: string
          created_at: string
          crop_type: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          price: number
          quantity: number
          unit: string
          updated_at: string
          user_id: string
          variety: string | null
        }
        Insert: {
          contact_info: string
          created_at?: string
          crop_type: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          price: number
          quantity: number
          unit: string
          updated_at?: string
          user_id: string
          variety?: string | null
        }
        Update: {
          contact_info?: string
          created_at?: string
          crop_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          price?: number
          quantity?: number
          unit?: string
          updated_at?: string
          user_id?: string
          variety?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          farm_size: string | null
          farming_experience: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          primary_crops: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          farm_size?: string | null
          farming_experience?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          primary_crops?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          farm_size?: string | null
          farming_experience?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          primary_crops?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      soil_analysis: {
        Row: {
          analysis_date: string
          created_at: string
          ec_level: number | null
          field_name: string
          id: string
          moisture: number | null
          nitrogen: number | null
          notes: string | null
          organic_matter: number | null
          ph_level: number | null
          phosphorus: number | null
          potassium: number | null
          user_id: string
        }
        Insert: {
          analysis_date: string
          created_at?: string
          ec_level?: number | null
          field_name: string
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          notes?: string | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus?: number | null
          potassium?: number | null
          user_id: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          ec_level?: number | null
          field_name?: string
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          notes?: string | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus?: number | null
          potassium?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_alert_preferences: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_enabled: boolean | null
          min_severity: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          min_severity?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          min_severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          alert_type: string
          created_at: string
          end_time: string | null
          id: string
          is_active: boolean | null
          location: string | null
          message: string
          severity: string
          start_time: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          message: string
          severity: string
          start_time: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          message?: string
          severity?: string
          start_time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "farmer" | "expert" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["farmer", "expert", "admin"],
    },
  },
} as const
