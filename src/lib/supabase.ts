import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dtdfzpsaxowfxybebykp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGZ6cHNheG93Znh5YmVieWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTU2MzQsImV4cCI6MjA5MTg3MTYzNH0.ZUu7Jv4Ist3Sjhx_cXHn8UMCOkcKqGnjwRbhmtjNe1g';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios no .env.local');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
