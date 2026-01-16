import { useState, useCallback, useEffect } from "react";

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
        const response = await fetch(finalUrl, options);

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }

        const jsonData = await response.json();
        setData(jsonData);
        return jsonData;
      } catch (err) {
        setError(err.message || "Something went wrong");
        setData(null);
        throw err; // Re-throw to allow caller to handle
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
