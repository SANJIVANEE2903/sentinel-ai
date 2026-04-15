import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzeAudio = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/analyze", formData);
};