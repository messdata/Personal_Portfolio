// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create a chainable mock query builder for build time
const createMockQueryBuilder = () => {
  const mockQuery = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    upsert: () => mockQuery,
    eq: () => mockQuery,
    neq: () => mockQuery,
    gt: () => mockQuery,
    gte: () => mockQuery,
    lt: () => mockQuery,
    lte: () => mockQuery,
    like: () => mockQuery,
    ilike: () => mockQuery,
    is: () => mockQuery,
    in: () => mockQuery,
    contains: () => mockQuery,
    containedBy: () => mockQuery,
    range: () => mockQuery,
    match: () => mockQuery,
    not: () => mockQuery,
    or: () => mockQuery,
    filter: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    range: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return mockQuery;
};

// Create a mock client for build time
const mockClient = {
  from: () => createMockQueryBuilder(),
  auth: {
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      remove: () => Promise.resolve({ data: null, error: null }),
      list: () => Promise.resolve({ data: [], error: null }),
    }),
  },
  rpc: () => Promise.resolve({ data: null, error: null }),
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
