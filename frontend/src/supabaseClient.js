import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nscrnlaukukiygnxlqyb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_uoqmIo52LVNCXXsl5A008A_j7FZacHZ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);