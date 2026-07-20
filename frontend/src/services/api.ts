import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  // Generous timeout: free-tier hosts (e.g. Render) spin down when
  // idle and can take 30-60s+ to wake up on the first request after
  // a period of inactivity.
  timeout: 60000
})