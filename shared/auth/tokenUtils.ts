export interface DecodedToken {
  sub: number;
  role: string;
  email: string;
  first_name: string;
  exp: number;
}

/**
 * Decode a JWT access token (without verification — verification is done server-side).
 * We only need to read the payload for display purposes.
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64url → Base64 → decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired based on its `exp` claim.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}
