import axios from "axios";
import { getAccessToken } from "./tokenStore";
import { API_BASE_URL } from "./config";
import { message } from "antd";

// Create a single axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // send cookies (refresh cookie lives here)
  headers: { Accept: "application/json", lang: "ar" },
});

// Attach access token (from memory) to every request
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
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



// // Refresh logic (single flight + retry queue)
// let isRefreshing = false;
// let pending = [];

// function onRefreshed(newToken) {
//   pending.forEach((cb) => cb(newToken));
//   pending = [];
// }

// http.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;

//     // If request was canceled/timeout or no response—just bubble up
//     if (!error.response) throw error;

//     const status = error.response.status;

//     // Avoid infinite loop
//     const isAuthCall = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/refresh");

//     if (status === 401 && !original._retry && !isAuthCall) {
//       original._retry = true;

//       // Queue requests while a refresh is in flight
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           pending.push((newToken) => {
//             if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
//             resolve(http(original));
//           });
//         });
//       }

//       isRefreshing = true;
//       try {
//         // Call your Next.js proxy to refresh using the HttpOnly cookie
//         const resp = await axios.post("/api/auth/refresh", null, { withCredentials: true });
//         const newToken = resp.data?.accessToken;
//         setAccessToken(newToken);
//         onRefreshed(newToken);
//         isRefreshing = false;

//         // retry original
//         if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
//         return http(original);
//       } catch (e) {
//         isRefreshing = false;
//         onRefreshed(null);
//         clearAccessToken();
//         // optional: redirect to login
//         if (typeof window !== "undefined") {
//           const next = window.location.pathname + window.location.search;
//           window.location.href = `/auth/login?next=${encodeURIComponent(next)}`;
//         }
//         throw e;
//       }
//     }

//     throw error;
//   }
// );

export default http;