from supabase_client import supabase
from datetime import datetime

def save_analysis(user_id, filename, result, confidence):
    data = {
        "user_id": user_id,
        "filename": filename,
        "result": result,
        "confidence": confidence,
        "created_at": datetime.now().isoformat()
    }

    response = supabase.table("analysis_history").insert(data).execute()
    return response


def get_history(user_id):
    response = supabase.table("analysis_history") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return response.data