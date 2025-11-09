// hooks/useCompetitiveAnalysis.js
import { useState, useCallback } from 'react';
import { competitiveAnalysisAPI } from '../../services/api';

export const useCompetitiveAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState({});

  const analyzeCompetitors = useCallback(async (yourSite, competitors, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.analyzeCompetitors(yourSite, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeKeywords = useCallback(async (yourSite, competitors, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.analyzeKeywords(yourSite, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeBacklinks = useCallback(async (yourSite, competitors, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.analyzeBacklinks(yourSite, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeAds = useCallback(async (yourSite, competitors, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.analyzeAds(yourSite, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSocial = useCallback(async (yourSite, competitors, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.analyzeSocial(yourSite, competitors, projectId);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResults = useCallback(async (analysisId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.getResults(analysisId);
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
      const response = await competitiveAnalysisAPI.getAnalysisStatus(analysisId);
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
    analyzeCompetitors,
    analyzeKeywords,
    analyzeBacklinks,
    analyzeAds,
    analyzeSocial,
    getResults,
    checkAnalysisStatus,
    clearError
  };
};