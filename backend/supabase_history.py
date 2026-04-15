from supabase_client import supabase
from datetime import datetime


# =========================
# SAVE ANALYSIS RESULT
# =========================
def save_analysis(user_id, filename, result, confidence):

    data = {
        "user_id": user_id,
        "filename": filename,
        "result": result,
        "confidence": confidence,
        "created_at": datetime.utcnow().isoformat()
    }

    try:
        response = supabase.table("analysis_history").insert(data).execute()
        return response.data

    except Exception as e:
        print("❌ Supabase Save Error:", e)
        return None


# =========================
# GET HISTORY
# =========================
def get_history(user_id):

    try:
        response = (
            supabase.table("analysis_history")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return response.data

    except Exception as e:
        print("❌ Supabase Fetch Error:", e)
        return []