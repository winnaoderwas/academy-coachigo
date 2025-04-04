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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          preferred_date: string | null
          preferred_time: string | null
          request_type: string | null
          status: string
          subject: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          preferred_date?: string | null
          preferred_time?: string | null
          request_type?: string | null
          status?: string
          subject: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          preferred_date?: string | null
          preferred_time?: string | null
          request_type?: string | null
          status?: string
          subject?: string
          topic?: string | null
        }
        Relationships: []
      }
      course_objectives: {
        Row: {
          course_id: string
          created_at: string
          id: string
          objective: string
          order_num: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          objective: string
          order_num: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          objective?: string
          order_num?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_objectives_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_syllabus: {
        Row: {
          course_id: string
          created_at: string
          description: string
          id: string
          order_num: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description: string
          id?: string
          order_num: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string
          id?: string
          order_num?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_syllabus_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_syllabus_details: {
        Row: {
          course_id: string | null
          course_syllabus_id: string | null
          created_at: string
          description: string | null
          downloads: string[] | null
          id: number
          Infos: string[] | null
          meeting_url: string | null
          title: string | null
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          course_syllabus_id?: string | null
          created_at?: string
          description?: string | null
          downloads?: string[] | null
          id?: number
          Infos?: string[] | null
          meeting_url?: string | null
          title?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          course_syllabus_id?: string | null
          created_at?: string
          description?: string | null
          downloads?: string[] | null
          id?: number
          Infos?: string[] | null
          meeting_url?: string | null
          title?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_syllabus_details_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_syllabus_details_course_syllabus_id_fkey"
            columns: ["course_syllabus_id"]
            isOneToOne: false
            referencedRelation: "course_syllabus"
            referencedColumns: ["id"]
          },
        ]
      }
      course_timetable: {
        Row: {
          chatgroup_link: string | null
          course_id: string
          course_syllabus_id: string | null
          created_at: string
          description: string | null
          id: string
          max_participants: number | null
          session_date: string
          session_end_date: string | null
          session_group_id: string | null
          title: string
          updated_at: string
          zoom_link: string | null
        }
        Insert: {
          chatgroup_link?: string | null
          course_id: string
          course_syllabus_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          max_participants?: number | null
          session_date: string
          session_end_date?: string | null
          session_group_id?: string | null
          title: string
          updated_at?: string
          zoom_link?: string | null
        }
        Update: {
          chatgroup_link?: string | null
          course_id?: string
          course_syllabus_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          max_participants?: number | null
          session_date?: string
          session_end_date?: string | null
          session_group_id?: string | null
          title?: string
          updated_at?: string
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_timetable_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_timetable_course_syllabus_id_fkey"
            columns: ["course_syllabus_id"]
            isOneToOne: false
            referencedRelation: "course_syllabus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_timetable_session_group_id_fkey"
            columns: ["session_group_id"]
            isOneToOne: false
            referencedRelation: "session_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          course_type: string | null
          courseinfo_video: string | null
          created_at: string
          description: string
          duration: string
          format: string
          id: string
          image_url: string
          instructor: string
          level: string
          openinfo_video: string | null
          price: number
          start_date: string
          target_group: string | null
          title: string
          "title.de": string | null
          updated_at: string
        }
        Insert: {
          category: string
          course_type?: string | null
          courseinfo_video?: string | null
          created_at?: string
          description: string
          duration: string
          format: string
          id?: string
          image_url: string
          instructor: string
          level: string
          openinfo_video?: string | null
          price: number
          start_date: string
          target_group?: string | null
          title: string
          "title.de"?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          course_type?: string | null
          courseinfo_video?: string | null
          created_at?: string
          description?: string
          duration?: string
          format?: string
          id?: string
          image_url?: string
          instructor?: string
          level?: string
          openinfo_video?: string | null
          price?: number
          start_date?: string
          target_group?: string | null
          title?: string
          "title.de"?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          certificate_issued: boolean
          completion_status: string
          course_id: string
          created_at: string
          enrollment_date: string
          id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_issued?: boolean
          completion_status: string
          course_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_issued?: boolean
          completion_status?: string
          course_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order_id: string
          price: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order_id: string
          price: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          invoice_id: string | null
          order_date: string
          payment_method: string | null
          payment_status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id?: string | null
          order_date?: string
          payment_method?: string | null
          payment_status: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string | null
          order_date?: string
          payment_method?: string | null
          payment_status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          phone: string | null
          street: string | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          street?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          street?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      session_bookings: {
        Row: {
          booked_at: string
          id: string
          session_group_id: string | null
          status: string
          timetable_id: string
          user_id: string
        }
        Insert: {
          booked_at?: string
          id?: string
          session_group_id?: string | null
          status?: string
          timetable_id: string
          user_id: string
        }
        Update: {
          booked_at?: string
          id?: string
          session_group_id?: string | null
          status?: string
          timetable_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_bookings_session_group_id_fkey"
            columns: ["session_group_id"]
            isOneToOne: false
            referencedRelation: "session_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_bookings_timetable_id_fkey"
            columns: ["timetable_id"]
            isOneToOne: false
            referencedRelation: "course_timetable"
            referencedColumns: ["id"]
          },
        ]
      }
      session_groups: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          max_participants: number | null
          name: string
          price: number
          start_date: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_participants?: number | null
          name: string
          price?: number
          start_date: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_participants?: number | null
          name?: string
          price?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_groups_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          company: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          name: string
          published: boolean
          rating: number | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name: string
          published?: boolean
          rating?: number | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name?: string
          published?: boolean
          rating?: number | null
          role?: string | null
          user_id?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
