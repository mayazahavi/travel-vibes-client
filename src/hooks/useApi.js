import { useState, useCallback, useEffect } from "react";
import { fetchJson } from "../services/http";

/**
 * Custom hook for API calls.
 * @param {string} initialUrl - The initial URL to fetch. Can be null if fetching manually later.
 * @param {Object} options - Fetch options (method, headers, etc.) and hook options.
 * @returns {Object} - { data, loading, error, refetch, setUrl }
 */
const useApi = (initialUrl = null, options = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (overrideUrl = null) => {
      const finalUrl = overrideUrl || url;

      if (!finalUrl) return;

      setLoading(true);
      setError(null);

      try {
        const jsonData = await fetchJson(finalUrl, options);
        setData(jsonData);
        return jsonData;
      } catch (err) {
        setError(err.message || "Something went wrong");
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options],
  );

  useEffect(() => {
    if (initialUrl) {
      fetchData(initialUrl);
    }
  }, [initialUrl, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setUrl,
  };
};

export default useApi;
