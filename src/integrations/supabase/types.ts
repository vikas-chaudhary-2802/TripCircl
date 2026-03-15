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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          trip_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          trip_id?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          trip_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string | null
          id: string
          paid_by: string
          split_among: string[] | null
          title: string
          trip_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date?: string | null
          id?: string
          paid_by: string
          split_among?: string[] | null
          title: string
          trip_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string | null
          id?: string
          paid_by?: string
          split_among?: string[] | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_items: {
        Row: {
          created_at: string
          created_by: string | null
          day: number
          id: string
          location: string | null
          notes: string | null
          time: string | null
          title: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          day: number
          id?: string
          location?: string | null
          notes?: string | null
          time?: string | null
          title: string
          trip_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          day?: number
          id?: string
          location?: string | null
          notes?: string | null
          time?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          pinned: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          budget_range: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          id: string
          id_verified: boolean | null
          languages: string[] | null
          location: string | null
          name: string
          phone: string | null
          phone_verified: boolean | null
          rating: number | null
          social_links: Json | null
          total_ratings: number | null
          travel_interests: string[] | null
          travel_style: Database["public"]["Enums"]["travel_style"] | null
          trips_joined: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          id?: string
          id_verified?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string
          phone?: string | null
          phone_verified?: boolean | null
          rating?: number | null
          social_links?: Json | null
          total_ratings?: number | null
          travel_interests?: string[] | null
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          trips_joined?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          id?: string
          id_verified?: boolean | null
          languages?: string[] | null
          location?: string | null
          name?: string
          phone?: string | null
          phone_verified?: boolean | null
          rating?: number | null
          social_links?: Json | null
          total_ratings?: number | null
          travel_interests?: string[] | null
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          trips_joined?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          communication: number | null
          created_at: string
          id: string
          reliability: number | null
          reviewee_id: string
          reviewer_id: string
          safety: number | null
          trip_id: string
        }
        Insert: {
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          reliability?: number | null
          reviewee_id: string
          reviewer_id: string
          safety?: number | null
          trip_id: string
        }
        Update: {
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          reliability?: number | null
          reviewee_id?: string
          reviewer_id?: string
          safety?: number | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ratings_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ratings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          status: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          status?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          status?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trips: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          country: string
          created_at: string
          current_members: number | null
          description: string | null
          destination: string
          end_date: string
          id: string
          image_url: string | null
          max_group_size: number | null
          organizer_id: string
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          travel_style: Database["public"]["Enums"]["travel_style"] | null
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          country: string
          created_at?: string
          current_members?: number | null
          description?: string | null
          destination: string
          end_date: string
          id?: string
          image_url?: string | null
          max_group_size?: number | null
          organizer_id: string
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          country?: string
          created_at?: string
          current_members?: number | null
          description?: string | null
          destination?: string
          end_date?: string
          id?: string
          image_url?: string | null
          max_group_size?: number | null
          organizer_id?: string
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      waitlist_emails: {
        Row: {
          created_at: string
          email: string
          feature: string
          id: string
          notified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          feature: string
          id?: string
          notified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          feature?: string
          id?: string
          notified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      travel_style:
        | "Backpacker"
        | "Luxury"
        | "Adventure"
        | "Digital Nomad"
        | "Cultural"
        | "Relaxation"
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
      travel_style: [
        "Backpacker",
        "Luxury",
        "Adventure",
        "Digital Nomad",
        "Cultural",
        "Relaxation",
      ],
    },
  },
} as const
