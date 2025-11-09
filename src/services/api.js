// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project context management
export const projectContext = {
  // Get available projects from localStorage (parsed as array)
  getAvailableProjects: () => {
    try {
      const projects = localStorage.getItem('availableProjects');
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error parsing availableProjects:', error);
      return [];
    }
  },
  
  setCurrentProject: (projectId) => {
    if (projectId) {
      localStorage.setItem('currentProjectId', projectId);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  },
  
  setAvailableProjects: (projects) => {
    try {
      localStorage.setItem('availableProjects', JSON.stringify(projects));
      const availableProjects = JSON.parse(localStorage.getItem('availableProjects') || '[]');
      if (availableProjects.length > 0) {
          localStorage.setItem('currentProjectId', availableProjects[0].id);
      } else {
          // Handle the case where no projects exist
          console.warn('No projects available');
      }

    } catch (error) {
      console.error('Error setting availableProjects:', error);
    }
  },
  
  getCurrentProject: () => {
    const currentProjectId = localStorage.getItem('currentProjectId');
    if (!currentProjectId) return null;
    
    const availableProjects = projectContext.getAvailableProjects();
    return availableProjects.find(p => p.id === currentProjectId); // Use == for type conversion
  },
  
  getCurrentProjectId: () => {
    return localStorage.getItem('currentProjectId');
  },
  
  hasCurrentProject: () => {
    return localStorage.getItem('currentProjectId') !== null;
  },
  
  clearCurrentProject: () => {
    localStorage.removeItem('currentProjectId');
  },
  
  clearAll: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentProjectId');
    localStorage.removeItem('availableProjects');
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      projectContext.clearAll();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function - Only add project_id if explicitly provided or if current project exists
const withOptionalProjectId = (data, projectId = undefined) => {
  // Use provided projectId, or fall back to current project ID
  let effectiveProjectId = projectId;
  
  if (projectId === undefined) {
    effectiveProjectId = projectContext.getCurrentProjectId();
  }
  
  // Only add project_id if we have a valid value (not null or undefined)
  if (effectiveProjectId !== null && effectiveProjectId !== undefined) {
    return {
      ...data,
      project_id: effectiveProjectId
    };
  }
  
  return data;
};

// SEO API endpoints - Automatically use current project if available
export const seoAPI = {
  analyzeSEO: (url, projectId = undefined) => 
    api.post('/api/v1/analyze/seo/', withOptionalProjectId({ url }, projectId)),
  
  analyzeSEOWithAI: (url, projectId = undefined) =>
    api.post('/api/v1/ai/analyze/seo/', withOptionalProjectId({ url }, projectId)),
  
  generateMetaTags: (url,content, focusKeywords = null, projectId = undefined) =>
    api.post('/api/v1/generate/meta/',  withOptionalProjectId({ 
      url, content, focus_keywords: focusKeywords 
    }, projectId)),
  
  generateMetaTagsWithAI: (url, content, focusKeywords = null, projectId = undefined) =>
    api.post('/api/v1/ai/generate/meta/', withOptionalProjectId({ 
      url, content, focus_keywords: focusKeywords 
    }, projectId)),
  
  getKeywordSuggestions: (keyword, projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { keyword, project_id: effectiveProjectId } : { keyword };
    return api.get('/api/v1/keywords/suggestions/', { params });
  },
  
  analyzeKeyword: (keyword, projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { keyword, project_id: effectiveProjectId } : { keyword };
    return api.get('/api/v1/keywords/analyze/', { params });
  },
  
  analyzeKeywordDensity: (text, focusKeywords = null, projectId = undefined) =>
    api.post('/api/v1/keywords/analyze-text/', withOptionalProjectId({ 
      text, focus_keywords: focusKeywords 
    }, projectId)),
  
  clusterKeywords: (keywords, projectId = undefined) =>
    api.post('/api/v1/keywords/cluster/', withOptionalProjectId({ keywords }, projectId)),
  
  generateKeywordSuggestionsWithAI: (topic, existingKeywords = null, projectId = undefined) =>
    api.post('/api/v1/ai/generate/keywords', withOptionalProjectId({ 
      topic, existing_keywords: existingKeywords 
    }, projectId)),
  
  generateContentSuggestionsWithAI: (topic, currentContent = null, projectId = undefined) =>
    api.post('/api/v1/ai/generate/content', withOptionalProjectId({ 
      topic, current_content: currentContent 
    }, projectId)),
  
  generateSEOReportWithAI: (analysisData, projectId = undefined) =>
    api.post('/api/v1/ai/generate/seo-report', withOptionalProjectId({ 
      analysis_data: analysisData 
    }, projectId)),

    getConversations: () => api.get('/api/v1/seo-chatbot/conversations'),
  
  createConversation: (data, projectId = undefined) => api.post('/api/v1/seo-chatbot/conversations',  withOptionalProjectId({ 
      data: data 
    }, projectId)),
  
  chat: (data, projectId = undefined) => api.post('/api/v1/seo-chatbot/chat',  withOptionalProjectId({ 
      data: data 
    }, projectId)),
  
  addFeedback: (data) => api.post('/api/v1/seo-chatbot/feedback', data),

    // Performance metrics endpoints
  getPerformanceMetrics: () => api.get('/api/v1/metrics'),
  getTrafficForecast: (months = 6) => api.get(`/api/v1/traffic-forecast?months=${months}`),
  getProjectPerformance: () => api.get('/api/v1/project-performance'),
  saveTrafficPrediction: (predictionData) => api.post('/api/v1/save-prediction', predictionData),

  // Ad campaign endpoints
  generateAdCampaign: (campaignData) => api.post('/api/v1/ad-campaigns/generate-campaign', campaignData),
  generateAdCreatives: (creativeData) => api.post('/api/v1/ad-campaigns/generate-creatives', creativeData),
  getAdIndustries: () => api.get('/api/v1/ad-campaigns/industries'),
  getAdCampaignTypes: () => api.get('/api/v1/ad-campaigns/campaign-types'),

  generateMultiPlatformCampaign: (campaignData) => api.post('/api/v1/ad-campaigns/generate-multi-platform-campaign', campaignData),
  createSocialFeed: (feedData) => api.post('/api/v1/ad-campaigns/create-social-feed', feedData),
  postToSocial: (postData) => api.post('/api/v1/ad-campaigns/post-to-social', postData),
  schedulePosts: (scheduleData) => api.post('/api/v1/ad-campaigns/schedule-posts', scheduleData),
  getAdPlatforms: () => api.get('/api/v1/ad-campaigns/platforms'),
  getContentTypes: () => api.get('/api/v1/ad-campaigns/content-types'),
  getPlatformConfig: (platform) => api.get(`/api/v1/ad-campaigns/platform-config/${platform}`),
  analyzeFeed: (feedData) => api.post('/api/v1/ad-campaigns/analyze-feed', feedData),
  getPostingSchedule: () => api.get('/api/v1/ad-campaigns/posting-schedule'),
  getBiddingStrategies: (platform) => api.get(`/api/v1/ad-campaigns/bidding-strategies/${platform}`),
  getAdTemplates: (platform) => api.get(`/api/v1/ad-campaigns/ad-templates/${platform}`),

  // Landing page endpoints
  generateLandingPage: (data) => api.post('/api/v1/landing-pages/generate', data),
  // analyzeSEO: (data) => api.post('/api/v1/landing-pages/analyze-seo', data),
  generateHTML: (data) => api.post('/api/v1/landing-pages/generate-html', data),
  getLandingPageTemplates: () => api.get('/api/v1/landing-pages/templates'),
  getConversionElements: () => api.get('/api/v1/landing-pages/conversion-elements'),
  
};

// Competitive Analysis API endpoints
export const competitiveAnalysisAPI = {
  // Main comprehensive analysis
  analyzeCompetitors: (yourSite, competitors = [], projectId = undefined) =>
    api.post('/api/v1/competitive-analysis/analyze', withOptionalProjectId({
      your_site: yourSite,
      competitors
    }, projectId)),
  
  // Keyword analysis only
  analyzeKeywords: (yourSite, competitors = [], projectId = undefined) =>
    api.post('/api/v1/competitive-analysis/analyze/keywords', withOptionalProjectId({
      your_site: yourSite,
      competitors
    }, projectId)),
  
  // Backlink analysis only
  analyzeBacklinks: (yourSite, competitors = [], projectId = undefined) =>
    api.post('/api/v1/competitive-analysis/analyze/backlinks', withOptionalProjectId({
      your_site: yourSite,
      competitors
    }, projectId)),

  
  // Ad campaign analysis only
  analyzeAds: (yourSite, competitors = [], projectId = undefined) =>
    api.post('/api/v1/competitive-analysis/analyze/ads', withOptionalProjectId({
      your_site: yourSite,
      competitors
    }, projectId)),
  
  // Social media analysis only
  analyzeSocial: (yourSite, competitors = [], projectId = undefined) =>
    api.post('/api/v1/competitive-analysis/analyze/social', withOptionalProjectId({
      your_site: yourSite,
      competitors
    }, projectId)),
  
  // Get analysis results
  getResults: (analysisId) =>
    api.get(`/api/v1/competitive-analysis/results/${analysisId}`),
  
  // Health check
  healthCheck: () =>
    api.get('/api/v1/competitive-analysis/health'),
  
  // Get all analyses for current project
  getProjectAnalyses: (projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    return effectiveProjectId 
      ? api.get('/analyses', { params: { project_id: effectiveProjectId } })
      : Promise.reject(new Error('No project selected'));
  },
  
  // Delete analysis
  deleteAnalysis: (analysisId) =>
    api.delete(`/analyses/${analysisId}`),
  
  // Get analysis status
  getAnalysisStatus: (analysisId) =>
    api.get(`/status/${analysisId}`),

  // Generate comprehensive backlink strategy
  generateBacklinkStrategy: (websiteUrl, industry, businessType, goals = [], timeframe = "3 months", projectId = undefined) =>
    api.post('/api/v1/backlink-program/generate-strategy', withOptionalProjectId({
      website_url: websiteUrl,
      industry,
      business_type: businessType,
      goals,
      timeframe
    }, projectId)),

  // Generate quick backlink plan
  generateQuickBacklinkPlan: (industry, businessType, urgency = "standard", projectId = undefined) =>
    api.post('/api/v1/backlink-program/quick-plan', withOptionalProjectId({
      industry,
      business_type: businessType,
      urgency
    }, projectId)),

  // Monitor backlink opportunities
  monitorBacklinkOpportunities: (websiteUrl, industry, projectId = undefined) =>
    api.post('/api/v1/backlink-program/monitor-opportunities', withOptionalProjectId({
      website_url: websiteUrl,
      industry
    }, projectId)),

  // Get industry-specific backlink resources
  getIndustryResources: (industry) =>
    api.get(`/api/v1/backlink-program/industry-resources/${industry}`),

  // Generate outreach templates
  generateOutreachTemplates: (industry, businessType, projectId = undefined) =>
    api.post('/api/v1/backlink-program/outreach-templates', withOptionalProjectId({
      industry,
      business_type: businessType
    }, projectId)),

  // Get posting schedule
  getPostingSchedule: (timeframe = "3 months", industry = null, projectId = undefined) =>
    api.post('/api/v1/backlink-program/posting-schedule', withOptionalProjectId({
      timeframe,
      industry
    }, projectId)),

  // Get content calendar
  getContentCalendar: (industry, businessType, timeframe = "3 months", projectId = undefined) =>
    api.post('/api/v1/backlink-program/content-calendar', withOptionalProjectId({
      industry,
      business_type: businessType,
      timeframe
    }, projectId)),

  // Get all available industries
  getAvailableIndustries: () =>
    api.get('/api/v1/backlink-program/industries'),

  // Test endpoint
  testBacklinkProgram: (industry, businessType, projectId = undefined) =>
    api.post('/api/v1/backlink-program/test', withOptionalProjectId({
      industry,
      business_type: businessType
    }, projectId)),

  // Get backlink strategy history
  getBacklinkStrategyHistory: (projectId, limit = 10) =>
    api.get('/api/v1/backlink-program/history', {
      params: { project_id: projectId, limit }
    })

};

// Social Media API endpoints
export const socialAPI = {
  SocialSuggestions: (topic, contentType = null, projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { 
      topic, content_type: contentType, project_id: effectiveProjectId 
    } : { topic, content_type: contentType };
    return api.get('/api/v1/social/suggestions/', { params });
  },
  
  getPostingSchedule: (platform, projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { platform, project_id: effectiveProjectId } : { platform };
    return api.get('/api/v1/social/schedule/', { params });
  },
  
  createSocialPost: (platform, accountId, content, mediaUrl = null, projectId = undefined) =>
    api.post('/api/v1/social/posts/', withOptionalProjectId({ 
      platform, account_id: accountId, content, media_url: mediaUrl 
    }, projectId)),
  
  generateSocialContentWithAI: (topic, platform, tone = 'professional', projectId = undefined) =>
    api.post('/api/v1/ai/generate/social', withOptionalProjectId({ 
      topic, platform, tone 
    }, projectId)),
};

// Content Generation API endpoints
export const contentAPI = {
  generateArticle: (topic, wordCount = 1000, tone = "professional", 
                   style = "informative", targetAudience = "general", 
                   useAI = false, projectId = undefined) =>
    api.post('/api/v1/content/generate/article/', withOptionalProjectId({
      topic, word_count: wordCount, tone, style, target_audience: targetAudience, use_ai: useAI
    }, projectId)),
  
  generateContentIdeas: (topic, count = 5, useAI = false, projectId = undefined) =>
    api.post('/api/v1/content/generate/ideas/', withOptionalProjectId({
      topic, count, use_ai: useAI
    }, projectId)),
  
  getGeneratedArticles: (projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    if (effectiveProjectId) {
      return api.get(`/api/v1/content/articles/${effectiveProjectId}`);
    }
    return api.get('/api/v1/content/articles/');
  },
  
  getArticleSections: (articleId) =>
    api.get(`/api/v1/content/articles/${articleId}/sections`),
};

// Backlink Analysis API endpoints
export const backlinkAnalysisAPI = {
  // Start backlink analysis
  analyzeBacklinks: (url, competitors = [], projectId = undefined) =>
    api.post('/api/v1/backlink-analysis/analyze-simple', withOptionalProjectId({
      url,
      competitors
    }, projectId)),
  
  // Get analysis history
  getAnalysisHistory: (projectId, limit = 10) =>
    api.get('/api/v1/backlink-analysis/history', { 
      params: { project_id: projectId, limit } 
    }),
  
  // Get specific analysis by ID
  getAnalysis: (analysisId, projectId = undefined) => {
    const params = {};
    if (projectId !== undefined) {
      params.project_id = projectId;
    }
    return api.get(`/api/v1/backlink-analysis/${analysisId}`, { params });
  },
  
  // Get all analyses for current project
  getProjectAnalyses: (projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    return effectiveProjectId 
      ? api.get('/api/v1/backlink-analysis/analyses', { params: { project_id: effectiveProjectId } })
      : Promise.reject(new Error('No project selected'));
  },
  
  // Delete analysis
  deleteAnalysis: (analysisId) =>
    api.delete(`/api/v1/backlink-analysis/${analysisId}`),
  
  // Get analysis status
  getAnalysisStatus: (analysisId) =>
    api.get(`/api/v1/backlink-analysis/status/${analysisId}`),
};

export const dashboardAPI = {
  getDashboardStats: () => 
    api.get('/api/v1/dashboard/stats/'),
  
  getRecentActivity: () => 
    api.get('/api/v1/dashboard/activity/'),
  
  getPerformanceMetrics: () => 
    api.get('/api/v1/dashboard/performance/'),
  
  getProjectStats: () => 
    api.get('/api/v1/dashboard/project-stats/'),
};
// Project & Dashboard API endpoints
export const projectAPI = {
  getDashboardStats: (projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { project_id: effectiveProjectId } : {};
    return api.get('/api/v1/dashboard/stats/', { params });
  },
  
  getRecentActivity: (projectId = undefined) => {
    let effectiveProjectId = projectId;
    if (projectId === undefined) {
      effectiveProjectId = projectContext.getCurrentProjectId();
    }
    
    const params = effectiveProjectId ? { project_id: effectiveProjectId } : {};
    return api.get('/api/v1/dashboard/activity/', { params });
  },
  
  getProjects: (userLocation = null) => {
  const params = {};
  if (userLocation) {
    params.location = userLocation;
  }
  return api.get('/api/v1/projects/', { params });
},
  
  createProject: (projectData) => api.post('/api/v1/projects/', projectData),
  
  updateProject: (projectId, projectData) => api.put(`/api/v1/projects/${projectId}/`, projectData),
  
  deleteProject: (projectId) => api.delete(`/api/v1/projects/${projectId}/`),
  
  getProjectMembers: (projectId) => api.get(`/projects/${projectId}/members`),
  addProjectMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),

  getSEOReport: (projectId, startDate, endDate) =>
    api.get(`/api/v1/reports/seo/${projectId}/?start_date=${startDate}&end_date=${endDate}`),
  
  getSMOReport: (projectId, startDate, endDate) =>
    api.get(`/api/v1/reports/smo/${projectId}/?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`),
  
  getComprehensiveReport: (projectId, startDate, endDate) =>
    api.get(`/api/v1/reports/comprehensive/${projectId}/?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`),

  // New methods for dashboard
  getUserProjectMappings: (userId, projectId) => 
    api.get('/api/v1/projects/user-mappings/', { params: { user_id: userId, project_id: projectId } }),
  
  getProjectAnalytics: (projectId) => 
    api.get(`/api/v1/projects/${projectId}/analytics/`),
  
  getUserProjectReport: (startDate, endDate) => 
    api.get('/api/v1/projects/reports/user-projects/', { params: { start_date: startDate, end_date: endDate } }),
  
  getProjectUsers: (projectId, location) => 
    api.get(`/api/v1/projects/${projectId}/users/`, { params: { location } }),
};

// Video Ad API endpoints
export const videoAPI = {
  generateCompleteContent: (topic, platform = "facebook", videoType = null, projectId = undefined) => {
    const data = { topic, platform };
    if (videoType) data.video_type = videoType;
    return api.post('/api/v1/video/generate-complete-content/', withOptionalProjectId(data, projectId));
  },
  
  generateAdCopy: (topic, platform, projectId = undefined) => 
    api.post('/api/v1/video/generate-ad-copy/', withOptionalProjectId({ topic, platform }, projectId)),
  
  generateVideoSnippets: (topic, videoType = null, projectId = undefined) => {
    const data = { topic };
    if (videoType) data.video_type = videoType;
    return api.post('/api/v1/video/generate-video-snippets/', withOptionalProjectId(data, projectId));
  },
  
 createVideoFromSnippet: (topic, snippetTitle, keyPoints = [], outputFormat = "mp4", projectId = undefined) => 
    api.post('/api/v1/video/create-video', withOptionalProjectId({
      topic,
      snippet_title: snippetTitle,
      key_points: keyPoints,
      output_format: outputFormat
    }, projectId)),

  // getVideoStatus: (videoId) => 
  //   api.get(`/api/v1/video/status/${videoId}`),

  // downloadVideo: (videoId) => 
  //   api.get(`/api/v1/video/download/${videoId}`),

  // getUserVideos: (projectId = undefined) => {
  //   const params = projectId ? { project_id: projectId } : {};
  //   return api.get('/api/v1/video/user-videos', { params });
  // },
  
  getContentSuggestions: (topic, maxResults = 5, projectId = undefined) => {
    const params = { topic, max_results: maxResults };
    if (projectId !== undefined || projectContext.getCurrentProjectId()) {
      params.project_id = projectId || projectContext.getCurrentProjectId();
    }
    return api.get('/api/v1/video/content-suggestions/', { params });
  },
  
  // Generate video synchronously
  generateVideo: (data) => 
    api.post('/api/v1/video-generation/text-to-video', data),

  // Generate video asynchronously
  generateVideoAsync: (data) => 
    api.post('/api/v1/video-generation/text-to-video/async', data),

  // Get video status for async jobs
  getVideoStatus: (videoId) => 
    api.get(`/api/v1/video-generation/status/${videoId}`),

  // Generate voiceover
  generateVoiceover: (data) => 
    api.post('/api/v1/video-generation/generate-voiceover', data),

  // Delete video
  deleteVideo: (filename) => 
    api.delete(`/api/v1/video-generation/video/${filename}`),

  // Get available options
  getVideoStyles: () => 
    api.get('/api/v1/video-generation/video-styles'),

  getAspectRatios: () => 
    api.get('/api/v1/video-generation/aspect-ratios'),

  getVoiceOptions: () => 
    api.get('/api/v1/video-generation/voice-options'),

  getMusicStyles: () => 
    api.get('/api/v1/video-generation/music-styles'),

  getPlatformSpecifications: () => 
    api.get('/api/v1/video-generation/platform-specifications'),

  // Statistics
  getStatistics: () => 
    api.get('/api/v1/video-generation/statistics'),

  // Health check
  getHealth: () => 
    api.get('/api/v1/video-generation/health'),

 
  // Video Enhancement Methods
enhanceExistingVideo: (formData) => 
    api.post('/api/v1/video-generation/enhance-existing', formData),

enhanceVideoWithUrl: (videoData) => 
    api.post('/api/v1/video-generation/enhance-with-url', videoData),


  getEnhancementStatus: () => 
    api.get('/api/v1/video-generation/enhancement-status'),

  getEnhancementPresets: () => 
    api.get('/api/v1/video-generation/enhancement-presets'),

textToVideoWith3DCharacter: (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return api.post('/api/v1/video-generation/text-to-video-with-3d-character', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
},

create3DCharacterOnly: (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return api.post('/api/v1/video-generation/create-3d-character', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
},
  // You might also want this for the download functionality
  downloadVideo: (videoPath) => {
    return fetch(`/api/v1/video-generation/download?path=${encodeURIComponent(videoPath)}`, {
      method: 'GET',
    });
  },
  // New 3D Character endpoints
  createSpeaking3DCharacter: (data) => api.post('/api/v1/3d-character/speaking', data),
  createAnimated3DCharacter: (data) => api.post('/api/v1/3d-character/animated', data),
  create3DCharacterWithAudio: (data) => api.post('/api/v1/3d-character/with-audio', data),
  integrate3DCharacterWithVideo: (data) => api.post('/api/v1/3d-character/integrate-with-video', data),
  create3DCharacterAsync: (data) => api.post('/api/v1/3d-character/async', data),
  get3DCharacterStyles: () => api.get('/api/v1/3d-character/styles'),
  get3DCharacterSystemStatus: () => api.get('/api/v1/3d-character/status'),
  get3DCharacterDetails: (characterId) => api.get(`/api/v1/3d-character/${characterId}`),
  delete3DCharacter: (characterId) => api.delete(`/api/v1/3d-character/${characterId}`),

  getSupportedPlatforms: () => 
    api.get('/api/v1/video/platforms/'),
  
  getSupportedVideoTypes: () => 
    api.get('/api/v1/video/video-types/')
};

// ===== CONTENT CALENDAR API ENDPOINTS =====
export const contentCalendarAPI = {
  // Generate a new content calendar
  generateContentCalendar: (projectId, topics = [], startDate = null, endDate = null) => {
    const data = { project_id: projectId };
    
    if (topics && topics.length > 0) {
      data.topics = topics;
    }
    
    if (startDate) {
      data.start_date = startDate;
    }
    
    if (endDate) {
      data.end_date = endDate;
    }
    
    return api.post('/api/v1/content-calendar/generate', data);
  },
  
  // Get Google OAuth URL
  getGoogleAuthUrl: () => 
    api.get('/api/v1/content-calendar/google/auth-url'),
  
  // Exchange Google authorization code for tokens
  exchangeGoogleCode: (code) => 
    api.post('/api/v1/content-calendar/google/exchange-code', { code }),
  
  // Sync with Trello
  syncWithTrello: (calendarId, apiKey, token, boardId = null) => 
    api.post('/api/v1/content-calendar/sync/trello', {
      calendar_id: calendarId,
      api_key: apiKey,
      token: token,
      board_id: boardId
    }),
  
  // Get specific content calendar by ID
  getCalendar: (calendarId) => 
    api.get(`/api/v1/content-calendar/${calendarId}`),
  
  // Get content calendar history for a project
  getCalendarHistory: (projectId, limit = 10) => 
    api.get(`/api/v1/content-calendar/project/${projectId}/history`, {
      params: { limit }
    }),
  
  // Get all content calendars for current user
  getAllCalendars: (limit = 10) => 
    api.get('/api/v1/content-calendar/history/all', {
      params: { limit }
    })
};

// Hashtag Generator API endpoints
export const hashtagAPI = {
  // Generate hashtags for content
  generateHashtags: (content, platform, topic = null, maxHashtags = 30) =>
    api.post('/api/v1/hashtags/generate', {
      content,
      platform,
      topic,
      max_hashtags: maxHashtags
    }),
  
  // Analyze a single hashtag
  analyzeHashtag: (hashtag) =>
    api.post('/api/v1/hashtags/analyze', { hashtag }),
  
  // Get platform recommendations
  getPlatformRecommendations: () =>
    api.get('/api/v1/hashtags/platforms')
};

// Image Suggestions API endpoints
export const imageSuggestionsAPI = {
  // Suggest images for a topic
  suggestImages: (topic, content = null, imageCount = 5, style = "realistic") =>
    api.post('/api/v1/image-suggestions/suggest', {
      topic,
      content,
      image_count: imageCount,
      style
    }),
  
  // Search free images
  searchFreeImages: (query, count = 10) =>
    api.post('/api/v1/image-suggestions/search', {
      query,
      count
    }),
  
  // Get AI tools
  getAITools: () =>
    api.get('/api/v1/image-suggestions/ai-tools'),
  
  // Get image sources
  getImageSources: () =>
    api.get('/api/v1/image-suggestions/sources')
};

// src/services/api.js - Add to your existing file

// Voice to Blog API endpoints
export const voiceToBlogAPI = {
  // Process audio from base64
  processAudio: (audioBase64, audioFormat = "wav", language = "en-US", topic = null) =>
    api.post('/api/v1/voice-to-blog/process-audio', {
      audio_base64: audioBase64,
      audio_format: audioFormat,
      language,
      topic
    }),
  
  // Upload audio file
  uploadAudio: (file, language = "en-US", topic = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    if (topic) formData.append('topic', topic);
    
    return api.post('/api/v1/voice-to-blog/upload-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Process text to blog
  processText: (text, topic = null) =>
    api.post('/api/v1/voice-to-blog/process-text', {
      text,
      topic
    }),
  
  // Get supported formats
  getSupportedFormats: () =>
    api.get('/api/v1/voice-to-blog/supported-formats'),
  
  // Get setup guide
  getSetupGuide: () =>
    api.get('/api/v1/voice-to-blog/setup-guide')
};


// Short Content API endpoints

export const shortContentAPI = {
  // Generate topic-based short content
  generateTopicContent: (topic, industry, contentTypes = ["tip", "fact", "question"], count = 10, platform = "all", projectId = undefined) =>
    api.post('/api/v1/short-content/generate-topic-content', withOptionalProjectId({
      topic,
      industry,
      content_types: contentTypes,
      count,
      platform
    }, projectId)),

  // Generate monthly content calendar
  generateMonthlyCalendar: (topic, industry, month, year = new Date().getFullYear(), platforms = ["instagram", "twitter", "facebook", "linkedin"], contentTypes = ["tip", "fact", "question", "quote"], postsPerDay = 2, projectId = undefined) =>
    api.post('/api/v1/short-content/generate-monthly-calendar', withOptionalProjectId({
      topic,
      industry,
      month,
      year,
      platforms,
      content_types: contentTypes,
      posts_per_day: postsPerDay
    }, projectId)),

  // Get available content types
  getContentTypes: () =>
    api.get('/api/v1/short-content/content-types'),

  // Get platform optimizations
  getPlatformOptimizations: (platform = null) => {
    const params = platform ? { platform } : {};
    return api.get('/api/v1/short-content/platform-optimizations', { params });
  },

  // Get available platforms
  getAvailablePlatforms: () =>
    api.get('/api/v1/short-content/platforms'),

  // Generate quick content batch
  generateQuickBatch: (topic, industry, count = 5, projectId = undefined) =>
    api.post('/api/v1/short-content/quick-batch', withOptionalProjectId({
      topic,
      industry,
      count
    }, projectId)),

  // Test endpoint
  testGenerator: (topic, industry, projectId = undefined) =>
    api.post('/api/v1/short-content/test', withOptionalProjectId({
      topic,
      industry
    }, projectId)),

  // Get content frameworks
  getContentFrameworks: (contentType = null) => {
    const params = contentType ? { content_type: contentType } : {};
    return api.get('/api/v1/short-content/content-frameworks', { params });
  },

generateContentPlan: (data) => {
    return api.post('/api/v1/short-content/generate-content-plan', data);
  },

  generateIndustryPlan: (data) => {
    return api.post('/api/v1/short-content/generate-industry-plan', data);
  },

  generateQuickContentPlan: (businessName, industry, services) => {
    return api.post('/api/v1/short-content/quick-content-plan', {
      business_name: businessName,
      industry: industry,
      services: services
    });
  },
    // Content Plan Management
  getContentPlans: (params = {}) => {
    return api.get('/api/v1/short-content/content-plans', { params });
  },

  getContentPlan: (planId) => {
    return api.get(`/api/v1/short-content/content-plans/${planId}`);
  },

  deleteContentPlan: (planId) => {
    return api.delete(`/api/v1/short-content/content-plans/${planId}`);
  },

  getContentPlanStats: () => {
    return api.get('/api/v1/short-content/content-plans-stats');
  },

  // Get available languages for translation
  getAvailableLanguages: () => {
    return Promise.resolve({
      data: {
        success: true,
        languages: [
          { code: 'english', name: 'English', nativeName: 'English' },
          { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
          { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
          { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
          { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
          { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
          { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
          { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
          { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
          { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
          { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
          { code: 'urdu', name: 'Urdu', nativeName: 'اردو' }
        ]
      }
    });
  },
};

// ... rest of your existing api.js code ...
// SEO Plan API
export const seoPlanApi = {
  generatePlan: (planData) => api.post('/api/v1/seo-plan/generate', planData),
  getUserPlans: (userId) => api.get(`/api/v1/seo-plan/users/${userId}/plans`),
  getPlanDetails: (planId) => api.get(`/api/v1/seo-plan/plans/${planId}`),
  updateTask: (taskId, updateData) => api.patch(`/api/v1/seo-plan/tasks/${taskId}`, updateData),
};

// Industries API
export const industriesApi = {
  getIndustries: () => api.get('/api/v1/industries/industries'),
  getIndustryDetails: (industryName) => api.get(`/api/v1/industries/industries/${industryName}`),
  getIndustryKeywords: (industryName, limit = 20, priority = null) => 
    api.get(`/api/v1/industries/industries/${industryName}/keywords`, {
      params: { limit, priority }
    }),
  getIndustryContentTypes: (industryName) => 
    api.get(`/api/v1/industries/industries/${industryName}/content-types`),
  initializeIndustries: () => api.post('/api/v1/industries/industries/initialize'),
};

// Trial API
export const trialApi = {
  startTrial: () => api.post('/api/v1/trial/start'),
  getTrialStatus: () => api.get('/api/v1/trial/status'),
  getTrialUsage: () => api.get('/api/v1/trial/usage'),
  convertToPaid: () => api.post('/api/v1/trial/convert'),
  extendTrial: (days) => api.post('/api/v1/trial/extend', { days }),
  initializeFeatures: () => api.post('/api/v1/admin/trial/initialize-features'),
};

// Authentication API endpoints
export const authAPI = {
  register: (userData) => api.post('/api/v1/auth/register/', userData),
  
  login: (email, password) => api.post('/api/v1/auth/login/', { email, password }),
  
  logout: () => {
    projectContext.clearAll();
    return api.post('/api/v1/auth/logout/');
  },
  
  getProfile: () => api.get('/api/v1/auth/profile/'),
  
  updateProfile: (profileData) => api.put('/api/v1/auth/profile/', profileData),
  
  handleLoginResponse: (response) => {
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      // If user has a default project, set it
      if (response.data.user?.default_project_id) {
        projectContext.setCurrentProject(response.data.user.default_project_id);
      }
    }
    return response;
  }
};

export default api;