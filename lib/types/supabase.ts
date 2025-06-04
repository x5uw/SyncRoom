/*
 * Database Tables:
 *  chat_messages
 *  participants
 *  playbac_events
 *  queue_tracks
 *  room_history
 *  rooms
 *  rooms_sync
 *  users 
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {

      chat_messages: {
        Row: {
          /** uuid NOT NULL */
          room_id: string
          /** uuid NOT NULL */
          user_id: string
          /** text NOT NULL */
          message: string
          /** timestamptz NOT NULL DEFAULT now() */
          created_at: string
          /** boolean DEFAULT false */
          deleted: boolean | null
        }
        Insert: {
          room_id: string
          user_id: string
          message: string
          created_at?: string       // DEFAULT now()
          deleted?: boolean         // DEFAULT false
        }
        Update: {
          room_id?: string
          user_id?: string
          message?: string
          created_at?: string
          deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
            isOneToOne: false
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
            isOneToOne: false
          }
        ]
      }

      participants: {
        Row: {
          /** uuid NOT NULL */
          room_id: string
          /** uuid NOT NULL */
          user_id: string
          /** timestamptz */
          left_at: string | null
          /** varchar DEFAULT 'member' */
          role: string | null
          /** timestamptz DEFAULT now() */
          joined_at: string
        }
        Insert: {
          room_id: string
          user_id: string
          left_at?: string | null      // optional
          role?: string | null         // DEFAULT 'member'
          joined_at?: string           // DEFAULT now()
        }
        Update: {
          room_id?: string
          user_id?: string
          left_at?: string | null
          role?: string | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
            isOneToOne: false
          },
          {
            foreignKeyName: "participants_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
            isOneToOne: false
          }
        ]
      }

      playback_events: {
        Row: {
          /** uuid */
          queue_track_id: string | null
          /** varchar NOT NULL */
          event_type: string
          /** integer */
          track_position: number | null
          /** uuid NOT NULL DEFAULT gen_random_uuid() */
          event_id: string
          /** timestamptz DEFAULT now() */
          created_at: string | null
        }
        Insert: {
          queue_track_id?: string | null
          event_type: string
          track_position?: number | null
          event_id?: string         // DEFAULT gen_random_uuid()
          created_at?: string | null // DEFAULT now()
        }
        Update: {
          queue_track_id?: string | null
          event_type?: string
          track_position?: number | null
          event_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playback_events_queue_track_id_fkey"
            columns: ["queue_track_id"]
            referencedRelation: "queue_tracks"
            referencedColumns: ["queue_track_id"]
            isOneToOne: false
          }
        ]
      }

      queue_tracks: {
        Row: {
          /** uuid */
          room_id: string | null
          /** varchar NOT NULL */
          track_url: string
          /** varchar NOT NULL */
          track_name: string
          /** varchar NOT NULL */
          artist_name: string
          /** uuid */
          added_by_user_id: string | null
          /** integer NOT NULL */
          queue_order: number
          /** integer NOT NULL */
          duration_ms: number
          /** uuid NOT NULL DEFAULT gen_random_uuid() */
          queue_track_id: string
        }
        Insert: {
          room_id?: string | null
          track_url: string
          track_name: string
          artist_name: string
          added_by_user_id?: string | null
          queue_order: number
          duration_ms: number
          queue_track_id?: string        // DEFAULT gen_random_uuid()
        }
        Update: {
          room_id?: string | null
          track_url?: string
          track_name?: string
          artist_name?: string
          added_by_user_id?: string | null
          queue_order?: number
          duration_ms?: number
          queue_track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_tracks_added_by_user_id_fkey"
            columns: ["added_by_user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
            isOneToOne: false
          },
          {
            foreignKeyName: "queue_tracks_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
            isOneToOne: false
          }
        ]
      }

      room_history: {
        Row: {
          /** uuid */
          user_id: string | null
          /** uuid */
          room_id: string | null
          /** uuid NOT NULL DEFAULT gen_random_uuid() */
          history_id: string
          /** timestamptz DEFAULT now() */
          last_joined: string | null
        }
        Insert: {
          user_id?: string | null
          room_id?: string | null
          history_id?: string         // DEFAULT gen_random_uuid()
          last_joined?: string | null // DEFAULT now()
        }
        Update: {
          user_id?: string | null
          room_id?: string | null
          history_id?: string
          last_joined?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
            isOneToOne: false
          },
          {
            foreignKeyName: "room_history_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
            isOneToOne: false
          }
        ]
      }

      rooms: {
        Row: {
          /** uuid */
          host_id: string | null
          /** varchar NOT NULL */
          name: string
          /** text */
          description: string | null
          /** timestamptz */
          playback_start_time: string | null
          /** uuid NOT NULL DEFAULT gen_random_uuid() */
          room_id: string
          /** boolean NOT NULL DEFAULT true */
          is_public: boolean
          /** boolean NOT NULL DEFAULT false */
          is_playing: boolean
          /** boolean NOT NULL DEFAULT false */
          is_live: boolean
          /** timestamptz DEFAULT now() */
          created_at: string | null
          /** timestamptz DEFAULT now() */
          updated_at: string | null
          /** varchar NOT NULL DEFAULT '' UNIQUE */
          join_id: string
          /** varchar NULLABLE */
          password: string

        }
        Insert: {
          host_id?: string | null
          name: string
          description?: string | null
          playback_start_time?: string | null
          room_id?: string            // DEFAULT gen_random_uuid()
          is_public?: boolean         // DEFAULT true
          is_playing?: boolean        // DEFAULT false
          is_live?: boolean           // DEFAULT false
          created_at?: string | null  // DEFAULT now()
          updated_at?: string | null  // DEFAULT now()
          join_id?: string            // DEFAULT ''
          password?: string | null
        }
        Update: {
          host_id?: string | null
          name?: string
          description?: string | null
          playback_start_time?: string | null
          room_id?: string
          is_public?: boolean
          is_playing?: boolean
          is_live?: boolean
          created_at?: string | null
          updated_at?: string | null
          join_id?: string
          password?: string | null
        }
        Relationships: []
      }

      rooms_sync: {
        Row: {
          /** text NOT NULL */
          room_id: string
          /** jsonb NOT NULL */
          payload: Json
          /** bigint NOT NULL DEFAULT nextval(...) */
          id: number
          /** timestamptz DEFAULT now() */
          inserted_at: string | null
        }
        Insert: {
          room_id: string
          payload: Json
          id?: number               // DEFAULT nextval(...)
          inserted_at?: string | null // DEFAULT now()
        }
        Update: {
          room_id?: string
          payload?: Json
          id?: number
          inserted_at?: string | null
        }
        Relationships: []
      }

      users: {
        Row: {
          /** uuid NOT NULL DEFAULT gen_random_uuid() */
          user_id: string
          /** varchar NOT NULL UNIQUE */
          username: string
          /** varchar NOT NULL UNIQUE */
          email: string
          /** varchar */
          spotify_user_id: string | null
          /** varchar */
          spotify_access_token: string | null
          /** varchar */
          spotify_refresh_token: string | null
          /** timestamptz DEFAULT now() */
          created_date: string
          /** timestamptz DEFAULT now() */
          updated_date: string
          /** timestamp without time zone */
          token_expires_at: string | null
        }
        Insert: {
          user_id?: string              // DEFAULT gen_random_uuid()
          username: string
          email: string
          spotify_user_id?: string | null
          spotify_access_token?: string | null
          spotify_refresh_token?: string | null
          created_date?: string         // DEFAULT now()
          updated_date?: string         // DEFAULT now()
          token_expires_at?: string | null
        }
        Update: {
          user_id?: string
          username?: string
          email?: string
          spotify_user_id?: string | null
          spotify_access_token?: string | null
          spotify_refresh_token?: string | null
          created_date?: string
          updated_date?: string
          token_expires_at?: string | null
        }
        Relationships: []
      }
    }

    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Simplified helper types that only index into "public"."Tables".
 * These will no longer produce the "cannot use type … as an index" error.
 */
export type PublicTableName = keyof Database["public"]["Tables"]

/** Lookup the Row type for a given table name */
export type TableRow<T extends PublicTableName> =
  Database["public"]["Tables"][T]["Row"]

/** Lookup the Insert type for a given table name */
export type TableInsert<T extends PublicTableName> =
  Database["public"]["Tables"][T]["Insert"]

/** Lookup the Update type for a given table name */
export type TableUpdate<T extends PublicTableName> =
  Database["public"]["Tables"][T]["Update"]

/** Example usage:
 *   const msg: TableRow<"chat_messages"> = { ... }
 *   const newUser: TableInsert<"users"> = { username: "...", email: "..." }
 */
