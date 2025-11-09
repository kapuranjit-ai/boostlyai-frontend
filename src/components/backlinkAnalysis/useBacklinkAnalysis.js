// hooks/useBacklinkAnalysis.js
import { useState, useCallback } from 'react';
import { backlinkAnalysisAPI } from '../../services/api';

export const useBacklinkAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState({});

  const analyzeBacklinks = useCallback(async (url, competitors = [], projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backlinkAnalysisAPI.analyzeBacklinks(url, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnalysisHistory = useCallback(async (projectId, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backlinkAnalysisAPI.getAnalysisHistory(projectId, limit);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnalysis = useCallback(async (analysisId, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backlinkAnalysisAPI.getAnalysis(analysisId, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAnalysisStatus = useCallback(async (analysisId) => {
    try {
      const response = await backlinkAnalysisAPI.getAnalysisStatus(analysisId);
      setAnalysisStatus(prev => ({
        ...prev,
        [analysisId]: response.data
      }));
      return response.data;
    } catch (err) {
      console.error('Error checking analysis status:', err);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    data,
    analysisStatus,
    analyzeBacklinks,
    getAnalysisHistory,
    getAnalysis,
    checkAnalysisStatus,
    clearError
  };
};