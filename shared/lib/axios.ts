import axios from "axios";

// A simple in-memory variable to hold our short-lived access token.
// Because it's just a variable, it is immune to XSS attacks (unlike localStorage).
let currentAccessToken = "";

export const setAccessToken = (token: string) => {
  currentAccessToken = token;
};

// 1. Create the Axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  // CRITICAL: This tells the browser to automatically attach our HttpOnly refresh_token cookie!
  withCredentials: true,
});

// 2. The Request Interceptor (The "ID Checker")
api.interceptors.request.use((config) => {
  // Every time we make a request, attach the access token if we have one
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// 3. The Response Interceptor (The "Refresh Magic")
api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the data
  async (error) => {
    const originalRequest = error.config;

    // If the backend says 401 Unauthorized, AND we haven't already retried this exact request...
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it so we don't get stuck in an infinite loop

      try {
        // Silently call our Go refresh endpoint.
        // We use a fresh axios instance here so we don't trigger the interceptors again.
        const res = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          {},
          { withCredentials: true },
        );

        // Save the brand new access token
        setAccessToken(res.data.access_token);

        // Update the failed request with the new token and try again!
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh fails (e.g., the 7-day cookie expired or was revoked in DB)
        // We wipe the token and force the user back to the login screen.
        setAccessToken("");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401, or the refresh failed, just pass the error back to the React component
    return Promise.reject(error);
  },
);
