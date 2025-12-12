import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Only validate and create client if we're not in build mode or if vars are present
let supabaseClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else if (typeof window !== 'undefined') {
  // Only throw error in browser, not during build
  console.error('Missing Supabase environment variables');
}

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
