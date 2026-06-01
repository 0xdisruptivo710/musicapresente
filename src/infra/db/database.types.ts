/**
 * Tipos do schema `cancao` (fonte de verdade: supabase/migrations/*).
 *
 * Escrito à mão porque o schema `cancao` NÃO está exposto no PostgREST e o
 * `generate_typescript_types` cobriria apenas o `public` compartilhado.
 * Ao alterar uma migration, atualize estes tipos na mesma tarefa.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  cancao: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: string;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: string;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          status?: string;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          id: string;
          tenant_id: string;
          code: string;
          name: string;
          description: string | null;
          base_price_cents: number;
          compare_at_price_cents: number | null;
          features: Json;
          addons: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          code: string;
          name: string;
          description?: string | null;
          base_price_cents: number;
          compare_at_price_cents?: number | null;
          features?: Json;
          addons?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          base_price_cents?: number;
          compare_at_price_cents?: number | null;
          features?: Json;
          addons?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          tenant_id: string;
          name: string | null;
          email: string | null;
          whatsapp: string | null;
          tax_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          tax_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          tax_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string | null;
          order_number: number;
          status: Database['cancao']['Enums']['order_status'];
          package_id: string | null;
          selected_addons: Json;
          photo_count: number | null;
          whatsapp: string | null;
          amount_cents: number | null;
          failure_reason: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id?: string | null;
          order_number?: number;
          status?: Database['cancao']['Enums']['order_status'];
          package_id?: string | null;
          selected_addons?: Json;
          photo_count?: number | null;
          whatsapp?: string | null;
          amount_cents?: number | null;
          failure_reason?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          customer_id?: string | null;
          order_number?: number;
          status?: Database['cancao']['Enums']['order_status'];
          package_id?: string | null;
          selected_addons?: Json;
          photo_count?: number | null;
          whatsapp?: string | null;
          amount_cents?: number | null;
          failure_reason?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_answers: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          occasion_category: string | null;
          occasion_moment: string | null;
          genres: string[];
          honoree_name: string | null;
          story: string | null;
          voice_gender: Database['cancao']['Enums']['voice_gender'] | null;
          extra: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          occasion_category?: string | null;
          occasion_moment?: string | null;
          genres?: string[];
          honoree_name?: string | null;
          story?: string | null;
          voice_gender?: Database['cancao']['Enums']['voice_gender'] | null;
          extra?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          occasion_category?: string | null;
          occasion_moment?: string | null;
          genres?: string[];
          honoree_name?: string | null;
          story?: string | null;
          voice_gender?: Database['cancao']['Enums']['voice_gender'] | null;
          extra?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lyrics: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          version: number;
          title: string | null;
          content: string;
          tone: string | null;
          model: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          version?: number;
          title?: string | null;
          content: string;
          tone?: string | null;
          model?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          version?: number;
          title?: string | null;
          content?: string;
          tone?: string | null;
          model?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      songs: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          version: Database['cancao']['Enums']['song_version'];
          suno_task_id: string | null;
          suno_audio_id: string | null;
          suno_audio_url: string | null;
          title: string | null;
          style: string | null;
          duration_seconds: number | null;
          preview_url: string | null;
          full_path: string | null;
          image_url: string | null;
          tags: string[];
          locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          version: Database['cancao']['Enums']['song_version'];
          suno_task_id?: string | null;
          suno_audio_id?: string | null;
          suno_audio_url?: string | null;
          title?: string | null;
          style?: string | null;
          duration_seconds?: number | null;
          preview_url?: string | null;
          full_path?: string | null;
          image_url?: string | null;
          tags?: string[];
          locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          version?: Database['cancao']['Enums']['song_version'];
          suno_task_id?: string | null;
          suno_audio_id?: string | null;
          suno_audio_url?: string | null;
          title?: string | null;
          style?: string | null;
          duration_seconds?: number | null;
          preview_url?: string | null;
          full_path?: string | null;
          image_url?: string | null;
          tags?: string[];
          locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          provider: string;
          abacatepay_id: string | null;
          amount_cents: number;
          status: Database['cancao']['Enums']['payment_status'];
          method: string | null;
          br_code: string | null;
          br_code_base64: string | null;
          expires_at: string | null;
          paid_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          provider?: string;
          abacatepay_id?: string | null;
          amount_cents: number;
          status?: Database['cancao']['Enums']['payment_status'];
          method?: string | null;
          br_code?: string | null;
          br_code_base64?: string | null;
          expires_at?: string | null;
          paid_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          provider?: string;
          abacatepay_id?: string | null;
          amount_cents?: number;
          status?: Database['cancao']['Enums']['payment_status'];
          method?: string | null;
          br_code?: string | null;
          br_code_base64?: string | null;
          expires_at?: string | null;
          paid_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tribute_pages: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          song_id: string | null;
          slug: string;
          title: string | null;
          photos: Json;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          song_id?: string | null;
          slug: string;
          title?: string | null;
          photos?: Json;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          song_id?: string | null;
          slug?: string;
          title?: string | null;
          photos?: Json;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      outbox_events: {
        Row: {
          id: string;
          tenant_id: string;
          aggregate_type: string;
          aggregate_id: string;
          event_type: string;
          payload: Json;
          status: string;
          attempts: number;
          error: string | null;
          dispatched_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          aggregate_type: string;
          aggregate_id: string;
          event_type: string;
          payload?: Json;
          status?: string;
          attempts?: number;
          error?: string | null;
          dispatched_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          aggregate_type?: string;
          aggregate_id?: string;
          event_type?: string;
          payload?: Json;
          status?: string;
          attempts?: number;
          error?: string | null;
          dispatched_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      processed_webhooks: {
        Row: {
          id: string;
          tenant_id: string | null;
          provider: string;
          event_id: string;
          event_type: string | null;
          order_id: string | null;
          payload: Json | null;
          processed_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          provider: string;
          event_id: string;
          event_type?: string | null;
          order_id?: string | null;
          payload?: Json | null;
          processed_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          provider?: string;
          event_id?: string;
          event_type?: string | null;
          order_id?: string | null;
          payload?: Json | null;
          processed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      order_status:
        | 'draft'
        | 'quiz_completed'
        | 'lyrics_generating'
        | 'lyrics_ready'
        | 'music_generating'
        | 'preview_ready'
        | 'awaiting_payment'
        | 'paid'
        | 'delivered'
        | 'failed'
        | 'expired'
        | 'refunded';
      payment_status:
        | 'pending'
        | 'paid'
        | 'expired'
        | 'cancelled'
        | 'refunded'
        | 'failed';
      song_version: 'v1' | 'v2';
      voice_gender: 'm' | 'f';
    };
    CompositeTypes: { [_ in never]: never };
  };
};
