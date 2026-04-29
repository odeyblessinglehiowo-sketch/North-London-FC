import { createClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          location: string;
          email: string;
          package: string;
          amount: number;
          reference: string;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          location: string;
          email: string;
          package: string;
          amount: number;
          reference: string;
        };
        Update: {
          id?: number;
          first_name?: string;
          last_name?: string;
          location?: string;
          email?: string;
          package?: string;
          amount?: number;
          reference?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let supabase: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase env missing");
    return null;
  }

  supabase = createClient<Database>(supabaseUrl, supabaseKey);
  return supabase;
};