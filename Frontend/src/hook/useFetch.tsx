import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';


export const useFetch = <T = any>(url: string, config?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(url, config)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
