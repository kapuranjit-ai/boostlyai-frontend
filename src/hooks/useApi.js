import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

export function useApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useApp();

  const callApi = useCallback(async (apiCall, successMessage = null, errorMessage = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      setData(response.data);
      
      if (successMessage) {
        addNotification({
          type: 'success',
          message: successMessage,
        });
      }
      
      return response.data;
    } catch (err) {
      const message = errorMessage || err.response?.data?.detail || 'An error occurred';
      setError(message);
      
      addNotification({
        type: 'error',
        message,
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  return { data, error, loading, callApi };
}