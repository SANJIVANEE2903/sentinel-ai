import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
import uuid

# AI imports
from model.preprocess import extract_spectrogram
from model.audio_model import load_model, predict_audio

# PDF
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

# ================= INIT =================
app = Flask(__name__)
CORS(app)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ================= LOAD MODEL =================
MODEL_PATH = "model/audio_model.keras"

if not os.path.exists(MODEL_PATH):
    raise Exception("❌ Model file not found!")

model = load_model(MODEL_PATH)
print("✅ Model loaded")

# ================= HOME =================
@app.route("/")
def home():
    return jsonify({"message": "Backend running 🚀"})


# ================= ANALYZE =================
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files["file"]
        user_id = request.form.get("user_id", "test-user")

        print("🎧 Processing:", file.filename)

        # Spectrogram
        spec = extract_spectrogram(file)

        # Prediction
        result = predict_audio(model, spec)
        confidence = result["confidence"]

        # Explainable AI
        if result["result"] == "fake":
            explanation = (
                "Strong synthetic patterns detected"
                if confidence > 0.8 else
                "Possible AI voice artifacts"
            )
        else:
            explanation = (
                "Natural human speech pattern"
                if confidence > 0.8 else
                "Mostly natural with slight anomalies"
            )

        # Save to Supabase
        supabase.table("analysis_history").insert({
            "user_id": user_id,
            "filename": file.filename,
            "result": result["result"],
            "confidence": confidence,
            "explanation": explanation
        }).execute()

        return jsonify({
            "filename": file.filename,
            "prediction": result["result"],
            "confidence": confidence,
            "explanation": explanation,
            "spectrogram": spec.tolist()
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ================= HISTORY =================
@app.route("/history", methods=["GET"])
def history():
    user_id = request.args.get("user_id", "test-user")

    res = supabase.table("analysis_history") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return jsonify(res.data)


# ================= PDF REPORT =================
@app.route("/report", methods=["POST"])
def report():
    data = request.json

    filename = f"report_{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(os.getcwd(), filename)

    doc = SimpleDocTemplate(filepath)
    styles = getSampleStyleSheet()

    content = [
        Paragraph(f"File: {data['filename']}", styles["Normal"]),
        Paragraph(f"Prediction: {data['prediction']}", styles["Normal"]),
        Paragraph(f"Confidence: {data['confidence']}", styles["Normal"]),
        Paragraph(f"Explanation: {data['explanation']}", styles["Normal"]),
    ]

    doc.build(content)

    return send_file(filepath, as_attachment=True)


# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=8000)