import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://klymqvelvxrihupbmgfz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseW1xdmVsdnhyaWh1cGJtZ2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTQzMjYsImV4cCI6MjA1ODQzMDMyNn0.JxXSfKtvk3vMimp0uapVzqMZ6pxUBUXWAiJ0qVNyohg'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
) 