import React from "react";

const ChatMessage = ({ type, text }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: type === "user" ? "flex-end" : "flex-start",
      marginBottom: "10px"
    }}>
      <div style={{
        background: type === "user" ? "#4F46E5" : "#222",
        color: "#fff",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "60%"
      }}>
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;