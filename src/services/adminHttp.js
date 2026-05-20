import axios from "axios";
import { getAccessToken } from "./tokenStore";
import { ADMIN_BASE_URL } from "./config";

const getCurrentLang = () => {
  if (typeof window === "undefined") return "ar";

  const localeFromPath = window.location.pathname.split("/")[1];

  if (["ar", "en"].includes(localeFromPath)) {
    return localeFromPath;
  }

  return document.documentElement.lang || "ar";
};

// admin panel axios instance
const adminHttp = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Attach access token + lang to every request
adminHttp.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.lang = getCurrentLang();

    return config;
  },
  (error) => Promise.reject(error)
);

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