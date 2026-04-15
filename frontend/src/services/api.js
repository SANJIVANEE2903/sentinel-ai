import axios from "axios";

const API = "http://localhost:8000";

// 🎧 Analyze Audio
export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", "test-user");

  return await axios.post(`${API}/analyze`, formData);
};

// 📜 Get History
export const getHistory = async () => {
  return await axios.get(`${API}/history?user_id=test-user`);
};