import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatDashboard from "./pages/ChatDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;