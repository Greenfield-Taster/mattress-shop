/**
 * API Client with automatic JWT token refresh.
 *
 * - On 401: tries to refresh the token once, then retries the original request.
 * - Proactive refresh: if token expires within REFRESH_THRESHOLD, refreshes in the background.
 * - Deduplicates concurrent refresh calls (only one in-flight at a time).
 * - Dispatches "auth:logout" event when refresh fails (token fully expired).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Refresh when less than 2 hours remain
const REFRESH_THRESHOLD_SECONDS = 2 * 60 * 60;

// Single in-flight refresh promise (deduplication)
let refreshPromise = null;

/**
 * Decode JWT payload without verification (client-side only).
 */
function decodeTokenPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Check if token is expiring within threshold.
 */
function isTokenExpiringSoon(token, thresholdSeconds = REFRESH_THRESHOLD_SECONDS) {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return true;
  const secondsRemaining = payload.exp - Date.now() / 1000;
  return secondsRemaining < thresholdSeconds;
}

/**
 * Call POST /auth/refresh to get a new token.
 */
async function refreshToken() {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token to refresh");

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  localStorage.setItem("authToken", data.token);
  return data.token;
}

/**
 * Deduplicated refresh — ensures only one refresh request is in-flight.
 */
function deduplicatedRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Proactive background refresh — call this periodically or before API calls.
 * Silently refreshes if token is close to expiry. Does not throw.
 */
export function proactiveRefresh() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  if (isTokenExpiringSoon(token)) {
    deduplicatedRefresh().catch(() => {
      // Silently fail — the 401 interceptor will handle full expiry
    });
  }
}

/**
 * Fetch wrapper that adds auth header and handles 401 with token refresh.
 *
 * Use this for any API call that might need authentication.
 * If the token is expired and refresh succeeds, the original request is retried.
 * If refresh fails, dispatches "auth:logout" and returns the 401 response.
 */
export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("authToken");

  // Add auth header if token exists
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    // Proactive refresh if nearing expiry
    if (isTokenExpiringSoon(token)) {
      try {
        const newToken = await deduplicatedRefresh();
        options.headers.Authorization = `Bearer ${newToken}`;
      } catch {
        // Continue with old token — might still be valid
      }
    }
  }

  let response = await fetch(url, options);

  // If 401 and we had a token, try refresh once
  if (response.status === 401 && token) {
    try {
      const newToken = await deduplicatedRefresh();
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, options);
    } catch {
      // Refresh failed — token is fully expired
      localStorage.removeItem("authToken");
      window.dispatchEvent(new Event("auth:logout"));
    }
  }

  return response;
}
