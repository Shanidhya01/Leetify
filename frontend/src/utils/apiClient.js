// Centralized API client with local -> cloud fallback
const PRIMARY_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FALLBACK_BASE = "https://coding-engine-trial.onrender.com";

async function tryFetchJson(base, path, options) {
  const res = await fetch(`${base}${path}`, options);
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchJsonWithFallback(path, options = {}, opts = {}) {
  const { fallbackOnEmpty = false } = opts;
  try {
    const data = await tryFetchJson(PRIMARY_BASE, path, options);
    if (fallbackOnEmpty && (data == null || (Array.isArray(data) && data.length === 0))) {
      // Try fallback if primary returned empty
      return await tryFetchJson(FALLBACK_BASE, path, options);
    }
    return data;
  } catch (_e) {
    // Try fallback host
    try {
      return await tryFetchJson(FALLBACK_BASE, path, options);
    } catch (e2) {
      // Re-throw last error
      throw e2;
    }
  }
}

export const API_BASE = PRIMARY_BASE;
export const API_FALLBACK = FALLBACK_BASE;
