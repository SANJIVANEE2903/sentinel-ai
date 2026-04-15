import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px"
    }}>
      <h2>🎙 Voice Forensics</h2>

      <nav style={{ marginTop: 20 }}>
        <p><Link to="/" style={{ color: "white" }}>Dashboard</Link></p>
        <p><Link to="/analyze" style={{ color: "white" }}>Analyze</Link></p>
        <p><Link to="/history" style={{ color: "white" }}>History</Link></p>
        <p><Link to="/compare" style={{ color: "white" }}>Compare</Link></p>
      </nav>
    </div>
  );
}