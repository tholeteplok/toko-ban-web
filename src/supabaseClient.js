import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewxmmyfuexexyczkcyfb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eG1teWZ1ZXhleHljemtjeWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzk1NzIsImV4cCI6MjA2MDcxNTU3Mn0.2BwviZ4DRFyEkTNxi0dPLbQQimTW_nywRxM_CSxvBcU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
