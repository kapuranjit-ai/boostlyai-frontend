// src/hooks/useImageSuggestions.js
import { useState, useCallback } from 'react';
import { imageSuggestionsAPI } from '../../services/api';

export const useImageSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [aiTools, setAiTools] = useState(null);
  const [sources, setSources] = useState(null);

  const suggestImages = useCallback(async (topic, content = null, imageCount = 5, style = "realistic") => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageSuggestionsAPI.suggestImages(topic, content, imageCount, style);
      setSuggestions(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get image suggestions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchImages = useCallback(async (query, count = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageSuggestionsAPI.searchFreeImages(query, count);
      setSearchResults(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to search images';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAITools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageSuggestionsAPI.getAITools();
      setAiTools(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get AI tools';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getImageSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageSuggestionsAPI.getImageSources();
      setSources(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get image sources';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    suggestions,
    searchResults,
    aiTools,
    sources,
    suggestImages,
    searchImages,
    getAITools,
    getImageSources,
    resetError: () => setError(null),
    resetData: () => {
      setSuggestions(null);
      setSearchResults(null);
    }
  };
};