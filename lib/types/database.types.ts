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
          created_at: string
          deleted: boolean | null
          message: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          message: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          message?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      participants: {
        Row: {
          joined_at: string | null
          left_at: string | null
          role: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          left_at?: string | null
          role?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          left_at?: string | null
          role?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      playback_events: {
        Row: {
          created_at: string | null
          event_id: string
          event_type: string
          queue_track_id: string | null
          track_position: number | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string
          event_type: string
          queue_track_id?: string | null
          track_position?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          event_type?: string
          queue_track_id?: string | null
          track_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playback_events_queue_track_id_fkey"
            columns: ["queue_track_id"]
            isOneToOne: false
            referencedRelation: "queue_tracks"
            referencedColumns: ["queue_track_id"]
          },
        ]
      }
      queue_tracks: {
        Row: {
          added_by_user_id: string | null
          artist_name: string
          duration_ms: number
          queue_order: number
          queue_track_id: string
          room_id: string | null
          track_name: string
          track_url: string
        }
        Insert: {
          added_by_user_id?: string | null
          artist_name: string
          duration_ms: number
          queue_order: number
          queue_track_id?: string
          room_id?: string | null
          track_name: string
          track_url: string
        }
        Update: {
          added_by_user_id?: string | null
          artist_name?: string
          duration_ms?: number
          queue_order?: number
          queue_track_id?: string
          room_id?: string | null
          track_name?: string
          track_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_tracks_added_by_user_id_fkey"
            columns: ["added_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "queue_tracks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
          },
        ]
      }
      room_history: {
        Row: {
          history_id: string
          last_joined: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          history_id?: string
          last_joined?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          history_id?: string
          last_joined?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          description: string | null
          host_id: string | null
          is_live: boolean
          is_playing: boolean
          is_public: boolean
          join_id: string
          last_active_at: string | null
          name: string | null
          password: string | null
          playback_start_time: string | null
          provider_refresh_token: string | null
          provider_token: string | null
          room_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          host_id?: string | null
          is_live?: boolean
          is_playing?: boolean
          is_public?: boolean
          join_id?: string
          last_active_at?: string | null
          name?: string | null
          password?: string | null
          playback_start_time?: string | null
          provider_refresh_token?: string | null
          provider_token?: string | null
          room_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          host_id?: string | null
          is_live?: boolean
          is_playing?: boolean
          is_public?: boolean
          join_id?: string
          last_active_at?: string | null
          name?: string | null
          password?: string | null
          playback_start_time?: string | null
          provider_refresh_token?: string | null
          provider_token?: string | null
          room_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rooms_sync: {
        Row: {
          id: number
          inserted_at: string | null
          payload: Json
          room_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string | null
          payload: Json
          room_id: string
        }
        Update: {
          id?: number
          inserted_at?: string | null
          payload?: Json
          room_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_date: string | null
          email: string
          spotify_access_token: string | null
          spotify_refresh_token: string | null
          spotify_user_id: string | null
          token_expires_at: string | null
          updated_date: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_date?: string | null
          email: string
          spotify_access_token?: string | null
          spotify_refresh_token?: string | null
          spotify_user_id?: string | null
          token_expires_at?: string | null
          updated_date?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_date?: string | null
          email?: string
          spotify_access_token?: string | null
          spotify_refresh_token?: string | null
          spotify_user_id?: string | null
          token_expires_at?: string | null
          updated_date?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_exact_row_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          exact_count: number
        }[]
      }
      handle_spotify_user: {
        Args: { event: Json }
        Returns: undefined
      }
      update_spotify_tokens: {
        Args: {
          p_user_id: string
          p_access: string
          p_refresh: string
          p_expires: number
        }
        Returns: undefined
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
    Enums: {},
  },
} as const
