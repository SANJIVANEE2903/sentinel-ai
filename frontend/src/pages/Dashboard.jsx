import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import Waveform from "../components/Waveform";
import { analyzeAudio, getHistory } from "../services/api";

import Heatmap from "../components/Heatmap";
import axios from "axios";

const ChatDashboard = () => {
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

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
    if (!file) return;

    const res = await analyzeAudio(file);

    setMessages(prev => [
      ...prev,
      { type: "ai", text: `Result: ${res.data.prediction}` },
      { type: "ai", text: `Confidence: ${(res.data.confidence * 100).toFixed(2)}%` },
      { type: "ai", text: `🧠 ${res.data.explanation}` }
    ]);

    loadHistory();
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

      {/* Chat Area */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>🎧 Sentinel AI Chat</h2>

        {/* Chat Messages */}
        <div style={{ minHeight: "300px" }}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} type={msg.type} text={msg.text} />
          ))}
        </div>

        {/* Upload */}
        <input type="file" accept=".wav" onChange={handleUpload} />

        {/* Waveform */}
        {audioUrl && <Waveform audioUrl={audioUrl} />}

        {/* Analyze */}
        <button onClick={handleAnalyze}>
          Analyze
        </button>
      </div>
    </div>
  );
};

export default ChatDashboard;