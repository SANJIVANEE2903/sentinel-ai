import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import Waveform from "../components/Waveform";
import Heatmap from "../components/Heatmap";
import { analyzeAudio, getHistory } from "../services/api";
import axios from "axios";

const ChatDashboard = () => {
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await getHistory();
    setHistory(res.data);
  };

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setAudioUrl(URL.createObjectURL(selected));

    setMessages(prev => [
      ...prev,
      { type: "user", text: `Uploaded: ${selected.name}` }
    ]);
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Upload file first");

    const res = await analyzeAudio(file);

    setHeatmap(res.data.spectrogram);
    setLastResult(res.data);

    setMessages(prev => [
      ...prev,
      { type: "ai", text: `Result: ${res.data.prediction}` },
      { type: "ai", text: `Confidence: ${(res.data.confidence * 100).toFixed(2)}%` },
      { type: "ai", text: `🧠 ${res.data.explanation}` }
    ]);

    loadHistory();
  };

  const downloadReport = async () => {
    if (!lastResult) return;

    const res = await axios.post(
      "http://localhost:8000/report",
      lastResult,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    link.click();
  };

  const handleSelectHistory = (item) => {
    setMessages([
      { type: "ai", text: `File: ${item.filename}` },
      { type: "ai", text: `Result: ${item.result}` },
      { type: "ai", text: `Confidence: ${(item.confidence * 100).toFixed(2)}%` },
      { type: "ai", text: `🧠 ${item.explanation}` }
    ]);
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar history={history} onSelect={handleSelectHistory} />

      {/* Main */}
      <div style={{ flex: 1, padding: 20 }}>
        <h2>🎧 Sentinel AI Chat</h2>

        {/* Chat */}
        <div style={{ minHeight: 300 }}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} type={msg.type} text={msg.text} />
          ))}
        </div>

        {/* Upload */}
        <input type="file" accept=".wav" onChange={handleUpload} />

        {/* Waveform */}
        {audioUrl && (
          <>
            <audio controls src={audioUrl}></audio>
            <Waveform audioUrl={audioUrl} />
          </>
        )}

        {/* Analyze */}
        <button onClick={handleAnalyze}>Analyze</button>

        {/* Heatmap */}
        {heatmap && (
          <>
            <h4>📊 Spectrogram</h4>
            <Heatmap spectrogram={heatmap} />
          </>
        )}

        {/* PDF */}
        <button onClick={downloadReport}>
          📄 Download Report
        </button>
      </div>
    </div>
  );
};

export default ChatDashboard;