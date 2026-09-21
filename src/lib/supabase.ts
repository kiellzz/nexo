import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
}

// Depois de gerar os tipos (npx supabase gen types typescript --project-id <ref> > src/types/database.ts),
// troque por: createClient<Database>(url, anonKey)
export const supabase = createClient(url, anonKey)