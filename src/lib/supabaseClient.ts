// @ts-ignore
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://btimnibnsoeotkomayte.supabase.co";
const supabaseKey = 
  (import.meta.env.SUPABASE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "";

if (!supabaseKey) {
  console.warn(
    "⚠️ WARNING: Supabase key is missing! Please create a '.env' file in the project root and add: \n" +
    "VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key\n" +
    "Or set it in your hosting platform (e.g., Vercel) environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey || "dummy-key-missing-please-set-in-env-file");


