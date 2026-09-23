import axios from "axios";

// Base URL of the Java Spring Boot REST API. Start it from Eclipse/STS,
// or with `mvn spring-boot:run` inside the autosphere-api project.
export const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api` 
  : "http://localhost:8080/api";
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the logged-in user's token (if any) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("asm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise errors so components can show a friendly message.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while talking to the server.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
