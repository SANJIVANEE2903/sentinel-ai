import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { FiActivity, FiBarChart2 } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function SaaSApp() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getHistory();
    setHistory(res.data);
  };

  const fakeCount = history.filter(h => h.result === "fake").length;
  const realCount = history.filter(h => h.result === "real").length;

  const chartData = history.map((h, i) => ({
    name: i + 1,
    confidence: h.confidence * 100
  }));

  return (
    <div className="saas-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🎧 Sentinel AI</h2>

        <div className="menu">
          <p>📜 History</p>
          <p>📊 Analytics</p>
          <p>⚙ Settings</p>
        </div>

        <div className="history">
          {history.map((h, i) => (
            <div key={i} className="history-item">
              <b>{h.filename}</b>
              <span className={h.result}>
                {h.result} • {(h.confidence * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="main">

        <h1>📊 AI Forensic Dashboard</h1>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <FiActivity size={20} />
            <h3>Total</h3>
            <p>{history.length}</p>
          </div>

          <div className="card fake">
            <h3>Fake</h3>
            <p>{fakeCount}</p>
          </div>

          <div className="card real">
            <h3>Real</h3>
            <p>{realCount}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="chart-box">
          <h3>Confidence Trends</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="confidence" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* INSIGHTS PANEL */}
      <div className="right">
        <h2>🧠 AI Insights</h2>

        <p>✔ MFCC Feature Extraction Active</p>
        <p>✔ Deep Learning Model Running</p>
        <p>✔ Supabase Logging Enabled</p>

        <hr />

        <p>📌 System Status: Healthy</p>
        <p>⚡ Avg Accuracy: ~90%</p>
      </div>

    </div>
  );
}