from fastapi import APIRouter, UploadFile, File
import numpy as np
import os
import uuid

from model_utils import load_model
from preprocess import extract_features

from supabase_history import save_analysis

router = APIRouter()

# Load model once
model = load_model()


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==============================
# HEALTH CHECK
# ==============================
@router.get("/")
def home():
    return {"message": "Voice Forensic API Running"}


# ==============================
# ANALYZE AUDIO FILE
# ==============================
@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):

    try:
        # Save uploaded file
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Extract features
        features = extract_features(file_path)

        if features is None:
            return {"error": "Feature extraction failed"}

        features = np.array([features])

        # =========================
        # PREDICTION
        # =========================
        pred = model.predict(features)[0][0]

        result = "FAKE" if pred > 0.5 else "REAL"
        confidence = float(pred)

        # =========================
        # SAVE TO SUPABASE
        # =========================
        save_analysis(
            user_id="demo_user",
            filename=file.filename,
            result=result,
            confidence=confidence
        )

        # =========================
        # RESPONSE
        # =========================
        return {
            "status": "success",
            "result": result,
            "confidence": confidence,
            "file": file.filename
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ==============================
# OPTIONAL: GET HISTORY API
# ==============================
@router.get("/history")
def get_history():
    from supabase_history import get_history

    return get_history("demo_user")