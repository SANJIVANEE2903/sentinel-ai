import React from "react";

const Sidebar = ({ history, onSelect }) => {
  return (
    <div style={{
      width: "250px",
      background: "#111",
      color: "#fff",
      height: "100vh",
      padding: "10px",
      overflowY: "auto"
    }}>
      <h3>📜 History</h3>

      {history.map((item, i) => (
        <div
          key={i}
          onClick={() => onSelect(item)}
          style={{
            padding: "10px",
            marginBottom: "8px",
            background: "#222",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          {item.filename}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;