import React, { useState } from "react";
import { analyzeAudio } from "../services/api";
import Waveform from "../components/Waveform";

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setAudioUrl(URL.createObjectURL(selected));
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Upload audio first");

    setLoading(true);
    try {
      const res = await analyzeAudio(file);
      setResult(res.data);
    } catch (err) {
      alert("Error analyzing audio");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎧 Audio Forensic AI</h2>

      <input type="file" accept=".wav" onChange={handleUpload} />

      {audioUrl && (
        <>
          <audio controls src={audioUrl}></audio>
          <Waveform audioUrl={audioUrl} />
        </>
      )}

      <button onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze Audio"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          <p>🧠 {result.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Analyze;