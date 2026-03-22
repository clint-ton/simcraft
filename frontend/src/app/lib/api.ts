// API URL detection: desktop app uses a fixed local server port
export const API_URL =
  typeof window !== "undefined" && window.electronAPI
    ? "http://localhost:17384"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
