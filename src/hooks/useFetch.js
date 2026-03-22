import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for API calls
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Ref to store the abort controller
  const abortControllerRef = useRef(null);

  // Function to fetch data
  const fetchData = useCallback(async (customUrl = url, customOptions = {}) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const fetchOptions = {
        ...options,
        ...customOptions,
        signal: abortControllerRef.current.signal
      };

      const response = await fetch(customUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setLastFetched(new Date());
      return result;
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong');
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Function to post data
  const postData = useCallback(async (postData, customUrl = url, customOptions = {}) => {
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...customOptions.headers
      },
      body: JSON.stringify(postData),
      ...customOptions
    };

    return fetchData(customUrl, postOptions);
  }, [url, options, fetchData]);

  // Function to put data
  const putData = useCallback(async (putData, customUrl = url, customOptions = {}) => {
    const putOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...customOptions.headers
      },
      body: JSON.stringify(putData),
      ...customOptions
    };

    return fetchData(customUrl, putOptions);
  }, [url, options, fetchData]);

  // Function to delete data
  const deleteData = useCallback(async (customUrl = url, customOptions = {}) => {
    const deleteOptions = {
      method: 'DELETE',
      ...options,
      ...customOptions
    };

    return fetchData(customUrl, deleteOptions);
  }, [url, options, fetchData]);

  // Auto-fetch on mount if autoFetch is enabled
  useEffect(() => {
    if (options.autoFetch && url) {
      fetchData();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, options.autoFetch, fetchData]);

  // Function to refetch data
  const refetch = useCallback(() => {
    if (url) {
      return fetchData();
    }
  }, [url, fetchData]);

  // Function to clear data
  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setLastFetched(null);
  }, []);

  // Function to clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    lastFetched,
    fetchData,
    postData,
    putData,
    deleteData,
    refetch,
    clearData,
    clearError
  };
};

// Custom hook for local storage operations
export const useLocalStorage = (key, initialValue) => {
  // Get stored value from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value to localStorage and state
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Custom hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for previous value
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
