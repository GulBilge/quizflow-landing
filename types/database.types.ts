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
      blog_posts: {
        Row: {
          id: string
          campaign_id: string
          meta_title: string
          meta_description: string
          og_title: string | null
          og_description: string | null
          outline: Json | null
          content_markdown: string
          content_html: string | null
          schema_jsonld: Json | null
          word_count: number | null
          reading_time_min: number | null
          version: number
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          meta_title: string
          meta_description: string
          og_title?: string | null
          og_description?: string | null
          outline?: Json | null
          content_markdown?: string
          content_html?: string | null
          schema_jsonld?: Json | null
          word_count?: number | null
          reading_time_min?: number | null
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          meta_title?: string
          meta_description?: string
          og_title?: string | null
          og_description?: string | null
          outline?: Json | null
          content_markdown?: string
          content_html?: string | null
          schema_jsonld?: Json | null
          word_count?: number | null
          reading_time_min?: number | null
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          title: string
          slug: string | null
          topic_seed: string
          target_keyword: string
          secondary_keywords: string[] | null
          search_volume: number | null
          difficulty_score: number | null
          status: string
          pipeline_stage: string
          target_audience: string | null
          content_angle: string | null
          cta_type: string | null
          reviewer_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          published_at: string | null
          blog_url: string | null
          page_views: number
          conversions: number
          avg_time_on_page: number | null
          performance_score: number | null
          n8n_execution_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          topic_seed: string
          target_keyword: string
          secondary_keywords?: string[] | null
          search_volume?: number | null
          difficulty_score?: number | null
          status?: string
          pipeline_stage?: string
          target_audience?: string | null
          content_angle?: string | null
          cta_type?: string | null
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          published_at?: string | null
          blog_url?: string | null
          page_views?: number
          conversions?: number
          avg_time_on_page?: number | null
          performance_score?: number | null
          n8n_execution_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          topic_seed?: string
          target_keyword?: string
          secondary_keywords?: string[] | null
          search_volume?: number | null
          difficulty_score?: number | null
          status?: string
          pipeline_stage?: string
          target_audience?: string | null
          content_angle?: string | null
          cta_type?: string | null
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          published_at?: string | null
          blog_url?: string | null
          page_views?: number
          conversions?: number
          avg_time_on_page?: number | null
          performance_score?: number | null
          n8n_execution_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          campaign_id: string
          platform: string
          content: Json
          status: string
          scheduled_at: string | null
          published_at: string | null
          platform_post_id: string | null
          platform_url: string | null
          impressions: number
          engagements: number
          link_clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          platform: string
          content: Json
          status?: string
          scheduled_at?: string | null
          published_at?: string | null
          platform_post_id?: string | null
          platform_url?: string | null
          impressions?: number
          engagements?: number
          link_clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          platform?: string
          content?: Json
          status?: string
          scheduled_at?: string | null
          published_at?: string | null
          platform_post_id?: string | null
          platform_url?: string | null
          impressions?: number
          engagements?: number
          link_clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      research_signals: {
        Row: {
          id: string
          campaign_id: string | null
          source: string
          raw_data: Json
          topic: string
          pain_points: string[] | null
          opportunity_score: number | null
          is_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          source: string
          raw_data: Json
          topic: string
          pain_points?: string[] | null
          opportunity_score?: number | null
          is_used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          source?: string
          raw_data?: Json
          topic?: string
          pain_points?: string[] | null
          opportunity_score?: number | null
          is_used?: boolean
          created_at?: string
        }
      }
      brand_voice_guidelines: {
        Row: {
          id: string
          category: string
          title: string
          content: string
          examples: Json | null
          is_active: boolean
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          content: string
          examples?: Json | null
          is_active?: boolean
          priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          content?: string
          examples?: Json | null
          is_active?: boolean
          priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_logs: {
        Row: {
          id: string
          campaign_id: string | null
          n8n_execution_id: string | null
          stage: string
          status: string
          agent_name: string | null
          model_used: string | null
          input_tokens: number | null
          output_tokens: number | null
          latency_ms: number | null
          error_message: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          n8n_execution_id?: string | null
          stage: string
          status: string
          agent_name?: string | null
          model_used?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          latency_ms?: number | null
          error_message?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          n8n_execution_id?: string | null
          stage?: string
          status?: string
          agent_name?: string | null
          model_used?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          latency_ms?: number | null
          error_message?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      performance_snapshots: {
        Row: {
          id: string
          campaign_id: string
          snapshot_date: string
          page_views: number
          unique_visitors: number
          avg_position: number | null
          impressions: number
          clicks: number
          ctr: number | null
          conversions: number
          bounce_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          snapshot_date: string
          page_views?: number
          unique_visitors?: number
          avg_position?: number | null
          impressions?: number
          clicks?: number
          ctr?: number | null
          conversions?: number
          bounce_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          snapshot_date?: string
          page_views?: number
          unique_visitors?: number
          avg_position?: number | null
          impressions?: number
          clicks?: number
          ctr?: number | null
          conversions?: number
          bounce_rate?: number | null
          created_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          created_by: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          is_pro: boolean | null
          monthly_upload_count: number | null
          created_at: string
          consecutive_quizzes_without_ad: number | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          is_pro?: boolean | null
          monthly_upload_count?: number | null
          created_at?: string
          consecutive_quizzes_without_ad?: number | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          is_pro?: boolean | null
          monthly_upload_count?: number | null
          created_at?: string
          consecutive_quizzes_without_ad?: number | null
        }
      }
      question_reports: {
        Row: {
          id: string
          user_id: string | null
          quiz_id: string | null
          question_index: number | null
          issue_type: string | null
          description: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          quiz_id?: string | null
          question_index?: number | null
          issue_type?: string | null
          description?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          quiz_id?: string | null
          question_index?: number | null
          issue_type?: string | null
          description?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          status: string | null
          score: number | null
          correct_count: number | null
          wrong_count: number | null
          user_answers: Json | null
          current_question_index: number | null
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          status?: string | null
          score?: number | null
          correct_count?: number | null
          wrong_count?: number | null
          user_answers?: Json | null
          current_question_index?: number | null
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          status?: string | null
          score?: number | null
          correct_count?: number | null
          wrong_count?: number | null
          user_answers?: Json | null
          current_question_index?: number | null
          started_at?: string | null
          completed_at?: string | null
        }
      }
      quiz_folders: {
        Row: {
          id: string
          created_by: string | null
          quiz_id: string
          folder_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          created_by?: string | null
          quiz_id: string
          folder_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          created_by?: string | null
          quiz_id?: string
          folder_id?: string
          created_at?: string | null
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          file_hash: string
          content: Json
          created_by: string | null
          created_at: string
          description: string | null
          question_count: number | null
        }
        Insert: {
          id?: string
          title: string
          file_hash: string
          content: Json
          created_by?: string | null
          created_at?: string
          description?: string | null
          question_count?: number | null
        }
        Update: {
          id?: string
          title?: string
          file_hash?: string
          content?: Json
          created_by?: string | null
          created_at?: string
          description?: string | null
          question_count?: number | null
        }
      }
      user_library: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          added_at: string
          last_accessed_at: string | null
          folder_id: string | null
          user_quiz_name: string | null
          user_folder_name: string | null
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          added_at?: string
          last_accessed_at?: string | null
          folder_id?: string | null
          user_quiz_name?: string | null
          user_folder_name?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          added_at?: string
          last_accessed_at?: string | null
          folder_id?: string | null
          user_quiz_name?: string | null
          user_folder_name?: string | null
        }
      }
      // NOTE: user_quizzes and user_folders types are managed via 'as any' casts
      // in quizService.ts because they reference migrated columns not in the generated types.
      // Run schema_migration.sql and regenerate types to resolve this.
      waitlist: {
        Row: {
          id: number
          email: string
          created_at: string
        }
        Insert: {
          id?: never
          email: string
          created_at?: string
        }
        Update: {
          id?: never
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      admin_kpi_summary: {
        Row: {
          total_users: number
          pool_size: number
          total_adoptions: number
          total_plays: number
          waitlist_count: number
        }
      }
      admin_popular_quizzes: {
        Row: {
          title: string
          adoption_count: number
          play_count: number
        }
      }
      admin_content_feed: {
        Row: {
          quiz_title: string
          created_at: string
          question_count: number
          creator_email: string
        }
      }
      admin_attempts_feed: {
        Row: {
          id: string
          email: string
          quiz_title: string
          status: string
          score: number | null
          started_at: string
          completed_at: string | null
        }
      }
      user_daily_engagement: {
        Row: {
          full_name: string
          email: string
          participation_rate: number
          active_days: string[]
          missed_days: string[]
        }
      }
      v_user_library: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          added_at: string
          last_accessed_at: string
          folder_id: string
          user_quiz_name: string
          user_folder_name: string
        }
      }
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
