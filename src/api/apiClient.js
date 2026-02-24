const API_BASE_URL = import.meta.env.VITE_API_URL;

const REFRESH_THRESHOLD_SECONDS = 2 * 60 * 60;

let refreshPromise = null;

function decodeTokenPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token, thresholdSeconds = REFRESH_THRESHOLD_SECONDS) {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return true;
  const secondsRemaining = payload.exp - Date.now() / 1000;
  return secondsRemaining < thresholdSeconds;
}

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

function deduplicatedRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function proactiveRefresh() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  if (isTokenExpiringSoon(token)) {
    deduplicatedRefresh().catch(() => {});
  }
}

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("authToken");

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (isTokenExpiringSoon(token)) {
      try {
        const newToken = await deduplicatedRefresh();
        options.headers.Authorization = `Bearer ${newToken}`;
      } catch {}
    }
  }

  let response = await fetch(url, options);

  if (response.status === 401 && token) {
    try {
      const newToken = await deduplicatedRefresh();
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, options);
    } catch {
      localStorage.removeItem("authToken");
      window.dispatchEvent(new Event("auth:logout"));
    }
  }

  return response;
}
