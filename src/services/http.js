import axios from "axios";
import { API_BASE_URL } from "./config";
import { message } from "antd";
import { getAccessToken, getRefreshToken, setAccessToken } from "./tokenStore";
import { refreshToken } from "./api";
import { useUserStore } from "@/store/useUserStore";

// Create a single axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // send cookies (refresh cookie lives here)
  headers: {
    Accept: "application/json",
    lang: "ar",
  },
});

// Attach access token (from memory) to every request
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log("HTTP Error:", error.status);
    if (error?.response?.status === 401) {
      refreshToken("", getRefreshToken())
        .then((res) => {
          const tokens = res?.token_response;
          setAccessToken(
            tokens?.access_token,
            tokens?.token_type,
            tokens?.refresh_token
          );
          useUserStore.getState().setUserData(tokens);
          // window.location.reload();
          error.config.headers.Authorization = `Bearer ${tokens?.access_token}`;
          return http(error.config);
        })
        .catch(() => {});
    } else if (error.response) {
      console.log("Response Error:", error.response.data);
      // message.error(error?.response?.data?.message || 'An error occurred');
    } else if (error.request) {
      console.log("Request Error:", error.request);
      message.error(
        "No response from server. Please check your network connection."
      );
    } else {
      console.log("Error:", error.message);
      // message.error(error.message || 'An error occurred');
    }
    return Promise.reject(error);
  }
);

export default http;
