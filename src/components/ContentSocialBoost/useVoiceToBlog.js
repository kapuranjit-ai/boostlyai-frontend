// src/hooks/useVoiceToBlog.js
import { useState, useCallback } from 'react';
import { voiceToBlogAPI } from '../../services/api';

export const useVoiceToBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [supportedFormats, setSupportedFormats] = useState(null);
  const [setupGuide, setSetupGuide] = useState(null);

  const processAudio = useCallback(async (audioBase64, audioFormat = "wav", language = "en-US", topic = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voiceToBlogAPI.processAudio(audioBase64, audioFormat, language, topic);
      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to process audio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAudio = useCallback(async (file, language = "en-US", topic = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voiceToBlogAPI.uploadAudio(file, language, topic);
      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to upload audio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const processText = useCallback(async (text, topic = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voiceToBlogAPI.processText(text, topic);
      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to process text';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSupportedFormats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await voiceToBlogAPI.getSupportedFormats();
      setSupportedFormats(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get supported formats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSetupGuide = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await voiceToBlogAPI.getSetupGuide();
      setSetupGuide(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get setup guide';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    result,
    supportedFormats,
    setupGuide,
    processAudio,
    uploadAudio,
    processText,
    getSupportedFormats,
    getSetupGuide,
    resetError: () => setError(null),
    resetData: () => setResult(null)
  };
};