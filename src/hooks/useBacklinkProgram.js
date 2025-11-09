import { useState, useCallback } from 'react';
import { competitiveAnalysisAPI } from '../services/api';

export const useBacklinkProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [industries, setIndustries] = useState([]);

  // Load available industries
  const loadIndustries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.getAvailableIndustries();
      if (response.data.success) {
        setIndustries(response.data.industries);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate comprehensive backlink strategy
  const generateBacklinkStrategy = useCallback(async (websiteUrl, industry, businessType, goals = [], timeframe = "3 months", projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.generateBacklinkStrategy(
        websiteUrl, 
        industry, 
        businessType, 
        goals, 
        timeframe, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate quick backlink plan
  const generateQuickBacklinkPlan = useCallback(async (industry, businessType, urgency = "standard", projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.generateQuickBacklinkPlan(
        industry, 
        businessType, 
        urgency, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Monitor backlink opportunities
  const monitorBacklinkOpportunities = useCallback(async (websiteUrl, industry, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.monitorBacklinkOpportunities(
        websiteUrl, 
        industry, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get industry resources
  const getIndustryResources = useCallback(async (industry) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.getIndustryResources(industry);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate outreach templates
  const generateOutreachTemplates = useCallback(async (industry, businessType, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.generateOutreachTemplates(
        industry, 
        businessType, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get posting schedule
  const getPostingSchedule = useCallback(async (timeframe = "3 months", industry = null, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.getPostingSchedule(
        timeframe, 
        industry, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get content calendar
  const getContentCalendar = useCallback(async (industry, businessType, timeframe = "3 months", projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await competitiveAnalysisAPI.getContentCalendar(
        industry, 
        businessType, 
        timeframe, 
        projectId
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility methods
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return {
    // State
    loading,
    error,
    data,
    industries,
    
    // Methods
    loadIndustries,
    generateBacklinkStrategy,
    generateQuickBacklinkPlan,
    monitorBacklinkOpportunities,
    getIndustryResources,
    generateOutreachTemplates,
    getPostingSchedule,
    getContentCalendar,
    
    // Utility Methods
    clearError,
    clearData
  };
};