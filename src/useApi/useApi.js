import { useState, useEffect } from 'react';
import handleApiError from './apiErrorHandler'; // Import the error handler
import axios from 'axios';
import Swal from 'sweetalert2';
const useApi = (initialUrl = null, initialConfig = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(initialUrl);
  const [config, setConfig] = useState(initialConfig);
  const [count,setCount]=useState(0)

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(url, config);
        const res = await response.json()
        const apiError = await handleApiError(res);
        if (apiError) {
          setError(apiError); 
        } else {
          
          // console.log('respnse data ==> ' ,responseData )
          setData(res.data)
          setCount(res?.count)
        }
    } catch (err) {
      setError(err || 'Something went wrong.');
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, config]);

  return { data, loading, error, setUrl, setConfig  ,count};
};

export default useApi;
