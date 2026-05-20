import axios from "axios";
import { API_BASE_URL } from "./config";
import { message } from "antd";
import { getAccessToken, getRefreshToken, setAccessToken } from "./tokenStore";
import { refreshToken } from "./api";
import { useUserStore } from "@/store/useUserStore";

const getCurrentLang = () => {
  if (typeof window === "undefined") return "ar";

  const localeFromPath = window.location.pathname.split("/")[1];

  if (["ar", "en"].includes(localeFromPath)) {
    return localeFromPath;
  }

  return document.documentElement.lang || "ar";
};

// Create a single axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Attach access token + lang to every request
http.interceptors.request.use(
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

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("HTTP Error:", error?.response?.status);

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken("", getRefreshToken());

        const tokens = res?.token_response;

        if (!tokens?.access_token) {
          return Promise.reject(error);
        }

        setAccessToken(
          tokens.access_token,
          tokens.token_type,
          tokens.refresh_token
        );

        useUserStore.getState().setUserData(tokens);

        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        originalRequest.headers.lang = getCurrentLang();

        return http(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        sessionStorage.clear();

        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.log("Response Error:", error.response.data);

      // message.error(error?.response?.data?.message || "An error occurred");
    } else if (error.request) {
      console.log("Request Error:", error.request);

      message.error(
        "No response from server. Please check your network connection."
      );
    } else {
      console.log("Error:", error.message);

      // message.error(error.message || "An error occurred");
    }

    return Promise.reject(error);
  }
);

export default http;