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
      users: {
        Row: {
          id: string
          name: string
          business_name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          business_name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          business_name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          duration: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          duration: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_hours: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          service_id: string
          date: string
          start_time: string
          client_name: string
          client_whatsapp: string
          status: 'confirmed' | 'cancelled' | 'completed'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          date: string
          start_time: string
          client_name: string
          client_whatsapp: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          date?: string
          start_time?: string
          client_name?: string
          client_whatsapp?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
