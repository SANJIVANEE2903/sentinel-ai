from supabase import create_client, Client

# 🔐 Replace with your Supabase credentials
SUPABASE_URL = "https://nscrnlaukukiygnxlqyb.supabase.co"
SUPABASE_KEY = "sb_publishable_uoqmIo52LVNCXXsl5A008A_j7FZacHZ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)