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
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          message: string
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          message: string
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      disaster_zones: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          last_incident: string | null
          latitude: number
          longitude: number
          radius: number
          risk_level: string
          updated_at: string
          zone_name: string
          zone_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_incident?: string | null
          latitude: number
          longitude: number
          radius?: number
          risk_level: string
          updated_at?: string
          zone_name: string
          zone_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_incident?: string | null
          latitude?: number
          longitude?: number
          radius?: number
          risk_level?: string
          updated_at?: string
          zone_name?: string
          zone_type?: string
        }
        Relationships: []
      }
      drill_participation: {
        Row: {
          completed_at: string | null
          drill_id: string
          id: string
          response_time_seconds: number | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          drill_id: string
          id?: string
          response_time_seconds?: number | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          drill_id?: string
          id?: string
          response_time_seconds?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drill_participation_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
        ]
      }
      drills: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          drill_name: string
          drill_type: string
          duration_minutes: number
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drill_name: string
          drill_type: string
          duration_minutes: number
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drill_name?: string
          drill_type?: string
          duration_minutes?: number
          id?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          incident_type: string
          latitude: number
          longitude: number
          reported_by: string | null
          severity: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          incident_type: string
          latitude: number
          longitude: number
          reported_by?: string | null
          severity: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          incident_type?: string
          latitude?: number
          longitude?: number
          reported_by?: string | null
          severity?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          available: boolean | null
          contact_info: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          owner_id: string
          resource_name: string
          resource_type: string
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          owner_id: string
          resource_name: string
          resource_type: string
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          owner_id?: string
          resource_name?: string
          resource_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          available: boolean | null
          created_at: string | null
          id: string
          proficiency_level: string
          skill_category: string
          skill_name: string
          user_id: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          proficiency_level: string
          skill_category: string
          skill_name: string
          user_id: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          proficiency_level?: string
          skill_category?: string
          skill_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vulnerability_registry: {
        Row: {
          address: string
          created_at: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          medical_conditions: string | null
          phone: string
          special_needs: string | null
          updated_at: string | null
          user_id: string
          vulnerability_type: string[]
        }
        Insert: {
          address: string
          created_at?: string | null
          emergency_contact?: string | null
          full_name: string
          id?: string
          medical_conditions?: string | null
          phone: string
          special_needs?: string | null
          updated_at?: string | null
          user_id: string
          vulnerability_type: string[]
        }
        Update: {
          address?: string
          created_at?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          medical_conditions?: string | null
          phone?: string
          special_needs?: string | null
          updated_at?: string | null
          user_id?: string
          vulnerability_type?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      app_role: "community_member" | "emergency_responder" | "community_lead"
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
      app_role: ["community_member", "emergency_responder", "community_lead"],
    },
  },
} as const
