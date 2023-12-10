import { useState, useEffect } from 'react';

const useApi = (initialUrl = null, initialConfig = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(initialUrl);
  const [config, setConfig] = useState(initialConfig);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong.');
      }

      setData(responseData);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, config]);

  return { data, loading, error, setUrl, setConfig };
};

export default useApi;
