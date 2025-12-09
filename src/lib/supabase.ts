// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client for build time
const mockClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
    }),
  },
} as any;

// Use real client if env vars exist, otherwise use mock
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockClient;

// Type definitions for your database
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Analytics' | 'Web Development' | 'Data Science' | 'Other';
  thumbnail_url: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
  main_tags: string[];
  tool_tags: string[];
  resources_link: string | null;
  slides: Slide[];
}

export interface Slide {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  replied: boolean;
  reply_text: string | null;
}

export interface Analytics {
  id: string;
  page_path: string;
  visitor_id: string | null;
  viewed_at: string;
  referrer: string | null;
  device_type: string | null;
}

export interface Media {
  id: string;
  cloudinary_id: string;
  url: string;
  thumbnail_url: string | null;
  format: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  uploaded_at: string;
  tags: string[];
  project_id: string | null;
  usage_type: 'thumbnail' | 'slide' | 'other' | null;
}
