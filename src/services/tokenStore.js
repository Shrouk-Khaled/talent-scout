// let accessToken = null;

// export function setAccessToken(token) {
//   accessToken = token || null;
// }

// export function getAccessToken() {
//   return accessToken;
// }

// export function clearAccessToken() {
//   accessToken = null;
// }

// tokenStore.js - Safe implementation for SSR

// Helper function to check if we're in the browser
const isBrowser = () => typeof window !== "undefined";

// Get access token from localStorage (only in browser)
export const getAccessToken = () => {
  if (!isBrowser()) return null;

  try {
    const userData = localStorage.getItem("user-data");
    if (!userData) return null;

    const parsedData = JSON.parse(userData);
    return parsedData?.state?.token || null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;

  try {
    const userData = localStorage.getItem("user-data");
    if (!userData) return null;

    const parsedData = JSON.parse(userData);
    return parsedData?.state?.userData?.refresh_token || null;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Set access token to localStorage (only in browser)
export const setAccessToken = (token, tokenType, refreshToken) => {
  if (!isBrowser()) return;

  try {
    const userData = localStorage.getItem("user-data");
    const parsedData = userData ? JSON.parse(userData) : {};

    const newData = {
      ...parsedData,
      state: {
        ...parsedData.state,
        userData: {
          ...parsedData?.state?.userData,
          token_type: tokenType,
          refresh_token: refreshToken,
        },
        token,
      },
    };

    localStorage.setItem("user-data", JSON.stringify(newData));
  } catch (error) {
    console.error("Error setting access token:", error);
  }
};

// Remove access token from localStorage (only in browser)
export const clearAccessToken = () => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem("user-data");
  } catch (error) {
    console.error("Error removing access token:", error);
  }
};

// Check if user is authenticated (only in browser)
export const isAuthenticated = () => {
  return !!getAccessToken();
};
