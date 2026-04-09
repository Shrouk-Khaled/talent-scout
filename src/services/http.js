import axios from "axios";
import { API_BASE_URL } from "./config";
import { message } from "antd";
import { getAccessToken, setAccessToken } from "./tokenStore";
import { refreshToken } from "./api";

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
    console.log('HTTP Error:', error.status);
    if(error?.response?.status === 401){
      refreshToken().then((res) => {
        console.log("new token:", res);
        setAccessToken(res?.access_token, res?.token_type);
        window.location.reload();
        // message.success('Session refreshed. Please try your action again.');
        // save the token
        // reload the page to retry the original request with the new token
        // window.location.reload();
      }).catch(() => {
      })
      // message.error('Unauthorized. Please log in again.');
      // localStorage.clear();
      // //redirect to login page
      // window.location.href = '/';
      // Optionally, you can trigger a logout or redirect to login page here
    } else
    if (error.response) {
      console.log('Response Error:', error.response.data);
      // message.error(error?.response?.data?.message || 'An error occurred');
    } else if (error.request) {
      console.log('Request Error:', error.request);
      message.error('No response from server. Please check your network connection.');
    } else {
      console.log('Error:', error.message);
      // message.error(error.message || 'An error occurred');
    }
    return Promise.reject(error);
  }
);

export default http;