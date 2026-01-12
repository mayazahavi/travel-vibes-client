import { useState, useCallback, useEffect } from 'react';

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

  const fetchData = useCallback(async (overrideUrl = null) => {
    const finalUrl = overrideUrl || url;
    
    // If no URL is available (and none provided as override), skip fetch
    if (!finalUrl) return;

    setLoading(true);
    setError(null);
    
    // Only clear data if we want to reset on new fetch, otherwise keep stale data while loading
    // setData(null); 

    try {
      const response = await fetch(finalUrl, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // If initialUrl is provided, we can fetch automatically.
  // If we want manual fetch only, pass null as initialUrl and use setUrl or refetch(url).
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
    setUrl // Expose setUrl to allow changing the URL dynamically
  };
};

export default useApi;

