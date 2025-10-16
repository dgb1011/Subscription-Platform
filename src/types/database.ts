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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'trial'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'trial'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          brewery_size: 'homebrewer' | 'nano' | 'micro' | 'regional'
          equipment_type: string[]
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          preferred_styles: string[]
          dietary_restrictions: string[]
          additional_notes: string | null
          ai_personality_profile: Json | null
          last_ai_analysis: string | null
          ai_feedback_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brewery_size: 'homebrewer' | 'nano' | 'micro' | 'regional'
          equipment_type: string[]
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          preferred_styles: string[]
          dietary_restrictions: string[]
          additional_notes?: string | null
          ai_personality_profile?: Json | null
          last_ai_analysis?: string | null
          ai_feedback_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brewery_size?: 'homebrewer' | 'nano' | 'micro' | 'regional'
          equipment_type?: string[]
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          preferred_styles?: string[]
          dietary_restrictions?: string[]
          additional_notes?: string | null
          ai_personality_profile?: Json | null
          last_ai_analysis?: string | null
          ai_feedback_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          beer_style: string
          batch_size: string
          equipment_required: string[]
          pdf_url: string | null
          beerxml_url: string | null
          tags: string[]
          ai_description: string | null
          ai_tags: string[] | null
          ai_difficulty_explanation: string | null
          ai_equipment_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          beer_style: string
          batch_size: string
          equipment_required: string[]
          pdf_url?: string | null
          beerxml_url?: string | null
          tags: string[]
          ai_description?: string | null
          ai_tags?: string[] | null
          ai_difficulty_explanation?: string | null
          ai_equipment_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          beer_style?: string
          batch_size?: string
          equipment_required?: string[]
          pdf_url?: string | null
          beerxml_url?: string | null
          tags?: string[]
          ai_description?: string | null
          ai_tags?: string[] | null
          ai_difficulty_explanation?: string | null
          ai_equipment_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      distributions: {
        Row: {
          id: string
          month: string
          year: number
          sent_at: string | null
          status: 'draft' | 'scheduled' | 'sent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          month: string
          year: number
          sent_at?: string | null
          status?: 'draft' | 'scheduled' | 'sent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          month?: string
          year?: number
          sent_at?: string | null
          status?: 'draft' | 'scheduled' | 'sent'
          created_at?: string
          updated_at?: string
        }
      }
      user_recipes: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          distribution_id: string
          match_score: number
          downloaded_at: string | null
          sent_at: string | null
          ai_match_reasoning: string | null
          ai_confidence_score: number | null
          user_feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          distribution_id: string
          match_score: number
          downloaded_at?: string | null
          sent_at?: string | null
          ai_match_reasoning?: string | null
          ai_confidence_score?: number | null
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          distribution_id?: string
          match_score?: number
          downloaded_at?: string | null
          sent_at?: string | null
          ai_match_reasoning?: string | null
          ai_confidence_score?: number | null
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          stripe_price_id: string
          name: string
          price_monthly: number
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_price_id: string
          name: string
          price_monthly: number
          features: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_price_id?: string
          name?: string
          price_monthly?: number
          features?: Json
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
