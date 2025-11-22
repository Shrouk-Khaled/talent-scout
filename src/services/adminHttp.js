import axios from "axios";
import { getAccessToken } from "./tokenStore";
import { ADMIN_BASE_URL } from "./config";

//admin panel axios instance
const adminHttp = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: 15000,
  withCredentials: true, // send cookies (refresh cookie lives here)
  headers: { Accept: "application/json", lang: "ar" },
});

// Attach access token (from memory) to every request
adminHttp.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminHttp.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.log("Response Error:", error.response.data);
    } else if (error.request) {
      console.log("Request Error:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default adminHttp;
