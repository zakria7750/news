import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type EditorialBoardMember = {
  id: string
  name: string
  position: string
  country: string
  image_url?: string
  section: "editor_in_chief" | "managing_editor" | "executive_manager" | "technical_committee" | "advisory_committee"
  created_at: string
  updated_at: string
}
