// src/hooks/useHashtagGenerator.js
import { useState, useCallback } from 'react';
import { hashtagAPI } from '../../services/api';

export const useHashtagGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hashtags, setHashtags] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [platforms, setPlatforms] = useState(null);

  const generateHashtags = useCallback(async (content, platform, topic = null, maxHashtags = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hashtagAPI.generateHashtags(content, platform, topic, maxHashtags);
      setHashtags(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to generate hashtags';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeHashtag = useCallback(async (hashtag) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hashtagAPI.analyzeHashtag(hashtag);
      setAnalysis(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to analyze hashtag';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlatformRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hashtagAPI.getPlatformRecommendations();
      setPlatforms(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch platform recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    hashtags,
    analysis,
    platforms,
    generateHashtags,
    analyzeHashtag,
    getPlatformRecommendations,
    resetError: () => setError(null),
    resetData: () => {
      setHashtags(null);
      setAnalysis(null);
    }
  };
};