import { api, setAccessToken } from "@/shared/lib/axios";
import axios from "axios";

/**
 * Register a new user account.
 * POST /auth/register { email, password, first_name }
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string
): Promise<void> {
  await api.post("/auth/register", {
    email,
    password,
    first_name: firstName,
  });
}

/**
 * Login with email and password.
 * POST /auth/login { email, password }
 * Returns the access_token string. The refresh_token is set as an HttpOnly cookie automatically.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  const res = await api.post("/auth/login", { email, password });
  const accessToken: string = res.data.access_token;
  setAccessToken(accessToken);
  return accessToken;
}

/**
 * Attempt to refresh the access token using the HttpOnly refresh cookie.
 * POST /auth/refresh (cookie is auto-sent by the browser because withCredentials=true)
 * Returns the new access_token, or throws if no valid cookie exists.
 */
export async function refreshToken(): Promise<string> {
  // Use a plain axios instance to avoid triggering the interceptor loop
  const res = await axios.post(
    "http://localhost:8080/api/v1/auth/refresh",
    {},
    { withCredentials: true }
  );
  const accessToken: string = res.data.access_token;
  setAccessToken(accessToken);
  return accessToken;
}

/**
 * Logout: revoke the refresh token server-side and clear the cookie.
 * POST /auth/logout (cookie is auto-sent)
 */
export async function logoutUser(): Promise<void> {
  try {
    await axios.post(
      "http://localhost:8080/api/v1/auth/logout",
      {},
      { withCredentials: true }
    );
  } catch {
    // Even if the server call fails, we still clear the local token
  }
  setAccessToken("");
}

/**
 * Fetch the current user's profile (requires valid access token).
 * GET /me
 */
export async function fetchMe(): Promise<{
  id: number;
  email: string;
  first_name: string;
  role: string;
}> {
  const res = await api.get("/me");
  return res.data;
}
