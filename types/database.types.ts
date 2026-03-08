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
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image_url: string | null
          is_published: boolean | null
          seo_keywords: string | null
          author_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image_url?: string | null
          is_published?: boolean | null
          seo_keywords?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image_url?: string | null
          is_published?: boolean | null
          seo_keywords?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string | null
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
