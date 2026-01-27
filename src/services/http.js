const DEFAULT_TIMEOUT_MS = 10000;

const parseJsonSafe = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const fetchJson = async (url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  try {
    const response = await fetchWithTimeout(url, options, timeoutMs);
    const data = await parseJsonSafe(response);

    if (!response.ok) {
      const message =
        data?.message || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      if (data?.errors) error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};
