import axios from "axios";
import { API_BASE_URL } from "./config";
import { message } from "antd";
import { getAccessToken } from "./tokenStore";

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
      message.error('Unauthorized. Please log in again.');
      localStorage.clear();
      //redirect to login page
      window.location.href = '/auth/login';
      // Optionally, you can trigger a logout or redirect to login page here
    } else
    if (error.response) {
      console.log('Response Error:', error.response.data);
      message.error(error?.response?.data?.message || 'An error occurred');
    } else if (error.request) {
      console.log('Request Error:', error.request);
      message.error('No response from server. Please check your network connection.');
    } else {
      console.log('Error:', error.message);
      message.error(error.message || 'An error occurred');
    }
    return Promise.reject(error);
  }
);

export default http;