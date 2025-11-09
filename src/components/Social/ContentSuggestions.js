import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  InputAdornment,
  Menu,
  MenuItem as MuiMenuItem,
  CircularProgress
} from '@mui/material';
import { 
  AutoAwesome, 
  Business,
  ExpandMore,
  CheckCircle,
  TrendingUp,
  Bolt,
  Delete,
  Visibility,
  History,
  Analytics,
  ContentCopy,
  Search,
  FilterList,
  MoreVert,
  Language
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { shortContentAPI } from '../../services/api';
import translationService from '../../services/translationService';
import { getLanguageName, getLanguageIcon, getNativeLanguageName } from '../../utils/languageUtils';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function ContentSuggestions() {
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('');
  const [platform, setPlatform] = useState('all');
  const [contentTypes, setContentTypes] = useState(['tip', 'fact', 'question']);
  const [count, setCount] = useState(5);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [availableContentTypes, setAvailableContentTypes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Language state
  const [language, setLanguage] = useState('english');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  
  // Existing state for content plans
  const [businessName, setBusinessName] = useState('');
  const [services, setServices] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [planDuration, setPlanDuration] = useState(7);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['google_business', 'linkedin', 'instagram', 'facebook']);
  const [targetAudience, setTargetAudience] = useState('');
  const [keyBenefits, setKeyBenefits] = useState('');
  
  // State for content plan management
  const [contentPlans, setContentPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewPlanDialog, setViewPlanDialog] = useState(false);
  const [deletePlanDialog, setDeletePlanDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingPlans, setLoadingPlans] = useState(false);

  const { data, error, loading, callApi } = useApi();

  // Load available data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [platformsResponse, typesResponse, languagesResponse] = await Promise.all([
          shortContentAPI.getAvailablePlatforms(),
          shortContentAPI.getContentTypes(),
          shortContentAPI.getAvailableLanguages()
        ]);
        
        if (platformsResponse.data.success) {
          setAvailablePlatforms(platformsResponse.data.platforms);
        }
        
        if (typesResponse.data.success) {
          setAvailableContentTypes(typesResponse.data.content_types);
        }

        if (languagesResponse.data.success) {
          setAvailableLanguages(languagesResponse.data.languages);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Load content plans when on the management tab
  useEffect(() => {
    if (activeTab === 3) {
      loadContentPlans();
      loadContentPlanStats();
    }
  }, [activeTab]);

  // Filter plans when search term or status filter changes
  useEffect(() => {
    filterPlans();
  }, [searchTerm, statusFilter, contentPlans]);

  const filterPlans = () => {
    let filtered = contentPlans;

    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    setFilteredPlans(filtered);
  };

  // Get display data (original English or translated)
  const getDisplayData = () => {
    if (language === 'english') {
      return data;
    }
    
    if (translatedData) {
      if (activeTab === 0) {
        return { content: translatedData };
      } else if (activeTab === 1 || activeTab === 2) {
        return { content_plan: translatedData };
      }
    }
    
    return data;
  };

  // Handle language change for translation
  const handleLanguageChange = async (newLanguage) => {
    if (!data || newLanguage === language) return;
    
    if (newLanguage === 'english') {
      // Switch back to English
      setLanguage('english');
      setTranslatedData(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      let contentToTranslate;
      
      if (activeTab === 0 && data.content) {
        contentToTranslate = data.content;
      } else if ((activeTab === 1 || activeTab === 2) && data.content_plan) {
        contentToTranslate = data.content_plan;
      }
      
      if (contentToTranslate) {
        const translatedContent = await translationService.translateContent(
          contentToTranslate, 
          newLanguage
        );
        
        setTranslatedData(translatedContent);
        setLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // API functions - always generate in English
  const generateTopicContent = async () => {
    // Reset translation when generating new content
    setTranslatedData(null);
    setLanguage('english');
    
    await callApi(
      () => shortContentAPI.generateTopicContent(
        topic, 
        industry, 
        contentTypes, 
        count, 
        platform
        // No language parameter - always English
      ),
      'Topic content generated successfully!'
    );
  };

  const generateContentPlan = async () => {
    setTranslatedData(null);
    setLanguage('english');
    
    const servicesArray = services.split(',').map(s => s.trim()).filter(s => s);
    await callApi(
      () => shortContentAPI.generateContentPlan({
        business_name: businessName,
        industry: industry,
        services: servicesArray,
        website_url: websiteUrl,
        plan_duration: planDuration,
        platforms: selectedPlatforms
        // No language parameter - always English
      }),
      'Content plan generated successfully!'
    );
  };

  const generateIndustryPlan = async () => {
    setTranslatedData(null);
    setLanguage('english');
    
    const servicesArray = services.split(',').map(s => s.trim()).filter(s => s);
    const benefitsArray = keyBenefits.split(',').map(b => b.trim()).filter(b => b);
    
    await callApi(
      () => shortContentAPI.generateIndustryPlan({
        business_name: businessName,
        industry: industry,
        services: servicesArray,
        target_audience: targetAudience,
        key_benefits: benefitsArray,
        website_url: websiteUrl,
        plan_duration: planDuration,
        platforms: selectedPlatforms
        // No language parameter - always English
      }),
      'Industry-specific content plan generated successfully!'
    );
  };

  // Rest of your existing functions (loadContentPlans, etc.)
  const loadContentPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await shortContentAPI.getContentPlans();
      if (response.data.success) {
        setContentPlans(response.data.content_plans || []);
      }
    } catch (err) {
      console.error('Failed to load content plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadContentPlanStats = async () => {
    try {
      const response = await shortContentAPI.getContentPlanStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to load content plan stats:', err);
    }
  };

  const getContentPlanById = async (planId) => {
    try {
      const response = await shortContentAPI.getContentPlan(planId);
      if (response.data.success) {
        setSelectedPlan(response.data.content_plan);
        setViewPlanDialog(true);
        return response.data.content_plan;
      }
    } catch (err) {
      console.error('Failed to get content plan:', err);
      throw err;
    }
  };
 const getContentPlanByName = async (businessName) => {
    try {
      // Since the API doesn't have a direct search by name endpoint,
      // we'll filter from the loaded plans or search through all plans
      const plans = contentPlans.length > 0 
        ? contentPlans 
        : (await shortContentAPI.getContentPlans({ limit: 100 })).data.content_plans;
      
      const foundPlan = plans.find(plan => 
        plan.business_name?.toLowerCase().includes(businessName.toLowerCase())
      );
      
      if (foundPlan) {
        // Get full plan details by ID
        return await getContentPlanById(foundPlan.id);
      }
      return null;
    } catch (err) {
      console.error('Failed to search content plan by name:', err);
      throw err;
    }
  };

  const searchContentPlan = async (searchValue) => {
    try {
      setLoadingPlans(true);
      
      // Try to find by ID first
      if (searchValue.length >= 8) { // Assuming IDs are at least 8 characters
        try {
          const plan = await getContentPlanById(searchValue);
          if (plan) {
            setFilteredPlans([plan]);
            return;
          }
        } catch (err) {
          // If not found by ID, continue with name search
        }
      }
      
      // Search by name or industry
      const response = await shortContentAPI.getContentPlans({ limit: 100 });
      if (response.data.success) {
        const plans = response.data.content_plans || [];
        const filtered = plans.filter(plan => 
          plan.business_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          plan.industry?.toLowerCase().includes(searchValue.toLowerCase()) ||
          plan.id?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredPlans(filtered);
      }
    } catch (err) {
      console.error('Failed to search content plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  };
  
  const deleteContentPlan = async (planId) => {
    try {
      const response = await shortContentAPI.deleteContentPlan(planId);
      if (response.data.success) {
        setContentPlans(prev => prev.filter(plan => plan.id !== planId));
        setFilteredPlans(prev => prev.filter(plan => plan.id !== planId));
        setDeletePlanDialog(false);
        setPlanToDelete(null);
        loadContentPlanStats();
      }
    } catch (err) {
      console.error('Failed to delete content plan:', err);
    }
  };

  const handleGenerate = () => {
    if (activeTab === 0) {
      generateTopicContent();
    } else if (activeTab === 1) {
      generateContentPlan();
    } else if (activeTab === 2) {
      generateIndustryPlan();
    }
  };

  const handleContentTypeChange = (contentType) => {
    setContentTypes(prev => 
      prev.includes(contentType) 
        ? prev.filter(type => type !== contentType)
        : [...prev, contentType]
    );
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleViewPlan = (plan) => {
    getContentPlanById(plan.id);
  };

  const handleDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setDeletePlanDialog(true);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      deleteContentPlan(planToDelete.id);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      searchContentPlan(searchTerm);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFilteredPlans(contentPlans);
  };

  const getTabIcon = (tabIndex) => {
    switch(tabIndex) {
      case 0: return <AutoAwesome />;
      case 1: return <Business />;
      case 2: return <TrendingUp />;
      case 3: return <History />;
      default: return <AutoAwesome />;
    }
  };

  const getTabLabel = (tabIndex) => {
    switch(tabIndex) {
      case 0: return 'Topic Content';
      case 1: return 'Content Plan';
      case 2: return 'Industry Plan';
      case 3: return 'My Plans';
      default: return 'Content';
    }
  };

  const isFormValid = () => {
    if (activeTab === 0) {
      if (!topic) return false;
      if (!industry) return false;
      if (contentTypes.length === 0) return false;
    } else if (activeTab === 1 || activeTab === 2) {
      if (!businessName) return false;
      if (!industry) return false;
      if (!services) return false;
      if (selectedPlatforms.length === 0) return false;
    }
    return true;
  };


  // Helper function to render topic content results
  const renderTopicContent = () => {
    if (!data || !data.content) return null;

    return (
      <Grid container spacing={3}>
        {data.content.content?.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Chip 
                  label={item.content_type} 
                  size="small" 
                  sx={{ mb: 1 }}
                  color="primary"
                />
                <Typography variant="body1" paragraph>
                  {item.content}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {item.hashtags?.map((tag, tagIndex) => (
                    <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                {item.optimization_tips && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Optimization: {item.optimization_tips}
                    </Typography>
                  </Box>
                )}
                {item.platform_specific && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Platform: {item.platform_specific}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Helper function to render content plans
// Updated renderContentPlan function with JSON parsing
const renderContentPlan = () => {
    const displayData = getDisplayData();
    if (!displayData || !displayData.content_plan) return null;

    let plan;
    try {
      plan = typeof displayData.content_plan === 'string' 
        ? JSON.parse(displayData.content_plan) 
        : displayData.content_plan;
    } catch (error) {
      console.error('Error parsing content_plan:', error);
      return (
        <Alert severity="error">
          Error parsing content plan data. Please try again.
        </Alert>
      );
    }

  // Debug log to check the parsed data
  console.log('Parsed plan:', plan);
  
  return (
    <Box>
        {/* Language Selection Bar */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Content Plan
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={getLanguageName(language)} 
                  color={language === 'english' ? 'primary' : 'secondary'}
                  size="small"
                />
                {language !== 'english' && (
                  <Chip 
                    label="Translated" 
                    size="small" 
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Language color="primary" />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Translate to</InputLabel>
                <Select
                  value={language}
                  label="Translate to"
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={isTranslating}
                >
                  {availableLanguages.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {getLanguageIcon(lang.code)}
                        </Typography>
                        <Box>
                          <Typography variant="body2">
                            {lang.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getNativeLanguageName(lang.code)}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isTranslating && <CircularProgress size={20} />}
            </Box>
          </Box>
        </Card>
      <Typography variant="h4" gutterBottom color="primary">
        {plan.content_plan.business_name} - {plan.content_plan.plan_duration}-Day Content Plan
      </Typography>
      
      {/* Plan Overview */}
      <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          Plan Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Business</Typography>
            <Typography variant="h6">{plan.content_plan.business_name}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Industry</Typography>
            <Typography variant="h6">{plan.content_plan.industry}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Duration</Typography>
            <Typography variant="h6">{plan.plan_duration} Days</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Total Posts</Typography>
            <Typography variant="h6">{plan.total_platform_posts}</Typography>
          </Grid>
        </Grid>
        
        {/* Services */}
        {plan.content_plan.services && plan.content_plan.services.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Services</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
              {plan.content_plan.services.map((service, index) => (
                <Chip 
                  key={index} 
                  label={service} 
                  size="small" 
                  variant="outlined" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Card>

      {/* Platforms */}
      {plan.content_plan.platforms && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Platforms
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {plan.content_plan.platforms.map((platform, index) => (
              <Chip 
                key={index} 
                label={platform.replace('_', ' ').toUpperCase()} 
                color="primary" 
                variant="outlined" 
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Daily Schedule */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Daily Content Schedule
      </Typography>
      
      {plan.content_plan.daily_posts ? (
        <Stepper orientation="vertical">
          {Object.entries(plan.content_plan.daily_posts).map(([dayKey, dayData]) => (
            <Step key={dayKey} active={true}>
              <StepLabel>
                <Typography variant="h6">
                  Day {dayData.day_number}: {dayData.theme}
                </Typography>
              </StepLabel>
              <StepContent>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      {dayData.theme}
                    </Typography>
                    
                    {/* Platform-specific content */}
                    {dayData.platform_content && Object.entries(dayData.platform_content).map(([platformKey, platformContent]) => (
                      <Accordion key={platformKey} sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                              {platformContent.platform?.replace('_', ' ').toUpperCase() || platformKey.replace('_', ' ').toUpperCase()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={`Engagement: ${platformContent.engagement_score || 'N/A'}`} 
                                size="small" 
                                color={(platformContent.engagement_score || 0) > 80 ? 'success' : 'default'}
                              />
                              <Chip 
                                label={`Relevance: ${platformContent.relevance_score || 'N/A'}`} 
                                size="small" 
                                color={(platformContent.relevance_score || 0) > 30 ? 'info' : 'default'}
                              />
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Content */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Content:
                            </Typography>
                            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                              {platformContent.content?.title && (
                                <Typography variant="h6" gutterBottom>
                                  {platformContent.content.title}
                                </Typography>
                              )}
                              <Typography variant="body1" paragraph>
                                {platformContent.content?.content || 'No content available'}
                              </Typography>
                              {platformContent.content?.cta && (
                                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                                  {platformContent.content.cta}
                                </Typography>
                              )}
                            </Card>
                          </Box>

                          {/* Hashtags */}
                          {platformContent.content?.hashtags && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Hashtags:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {platformContent.content.hashtags.split(' ').map((tag, tagIndex) => (
                                  <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {/* Key Points */}
                          {platformContent.content?.key_points && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Key Points:
                              </Typography>
                              <List dense>
                                {platformContent.content.key_points.map((point, pointIndex) => (
                                  <ListItem key={pointIndex}>
                                    <ListItemIcon>
                                      <CheckCircle color="success" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={point} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}

                          {/* Image Ideas */}
                          {platformContent.content?.image_ideas && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Image Ideas:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {platformContent.content.image_ideas.map((idea, ideaIndex) => (
                                  <Chip 
                                    key={ideaIndex} 
                                    label={idea} 
                                    size="small" 
                                    variant="outlined"
                                    color="secondary"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {/* Engagement Tips */}
                          {platformContent.content?.engagement_tips && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Engagement Tips:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {platformContent.content.engagement_tips.map((tip, tipIndex) => (
                                  <Chip 
                                    key={tipIndex} 
                                    label={tip} 
                                    size="small" 
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {/* Posting Details */}
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" gutterBottom>
                                Optimal Posting Times:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {platformContent.optimal_posting_time?.map((time, timeIndex) => (
                                  <Chip 
                                    key={timeIndex} 
                                    label={time} 
                                    size="small" 
                                    color="default"
                                  />
                                ))}
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" gutterBottom>
                                Character Count: {platformContent.content?.character_count || 'N/A'}
                              </Typography>
                              <Typography variant="subtitle2" gutterBottom>
                                Platform Optimized: {platformContent.content?.platform_optimized ? 'Yes' : 'No'}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* CTA Recommendations */}
                          {platformContent.cta_recommendations && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                CTA Recommendations:
                              </Typography>
                              {platformContent.cta_recommendations.map((cta, ctaIndex) => (
                                <Alert 
                                  key={ctaIndex} 
                                  severity="info" 
                                  sx={{ mt: 1 }}
                                  icon={<CheckCircle />}
                                >
                                  {cta}
                                </Alert>
                              ))}
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Alert severity="warning">
          No daily posts data available in the content plan.
        </Alert>
      )}

      {/* Plan Summary */}
      <Card sx={{ mt: 4, p: 3, bgcolor: 'success.light', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          Plan Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Total Days</Typography>
            <Typography variant="h6">{plan.total_days || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Total Platform Posts</Typography>
            <Typography variant="h6">{plan.total_platform_posts || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Platforms Used</Typography>
            <Typography variant="h6">{plan.platforms?.length || 0}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2">Generated</Typography>
            <Typography variant="h6">
              {plan.generated_at ? new Date(plan.generated_at).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
        
        {plan.website_url && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Website</Typography>
            <Typography variant="h6">
              <a 
                href={plan.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'white', textDecoration: 'underline' }}
              >
                {plan.website_url}
              </a>
            </Typography>
          </Box>
        )}
      </Card>
      <Alert severity="info">
          Content plan displayed in {getLanguageName(language)}
          {language !== 'english' && ' (translated from English)'}
        </Alert>
    </Box>
  );
};

 // Helper function to render content plan management
  const renderContentPlanManagement = () => {
    const displayPlans = searchTerm ? filteredPlans : contentPlans;

    return (
      <Box>
        {/* Statistics Card */}
        {stats && (
          <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              <Analytics sx={{ mr: 1 }} />
              Content Plan Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Total Plans</Typography>
                <Typography variant="h6">{stats.total_plans || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Active Plans</Typography>
                <Typography variant="h6">{stats.active_plans || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Total Posts</Typography>
                <Typography variant="h6">{stats.total_posts || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Platforms Used</Typography>
                <Typography variant="h6">{stats.platforms_used || 0}</Typography>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by ID, business name, or industry..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                startIcon={<FilterList />}
                onClick={handleFilterClick}
                variant="outlined"
              >
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                onClick={clearFilters}
                variant="outlined"
                color="secondary"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Status Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MuiMenuItem onClick={() => handleStatusFilter('all')}>
              All Status
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleStatusFilter('active')}>
              Active
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleStatusFilter('draft')}>
              Draft
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleStatusFilter('archived')}>
              Archived
            </MuiMenuItem>
          </Menu>
        </Card>

        {/* Content Plans Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                My Content Plans {searchTerm && `(${filteredPlans.length} found)`}
              </Typography>
              <Button
                startIcon={<ContentCopy />}
                onClick={loadContentPlans}
                disabled={loadingPlans}
              >
                Refresh
              </Button>
            </Box>
            
            {loadingPlans ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : displayPlans.length === 0 ? (
              <Alert severity="info">
                {searchTerm 
                  ? `No content plans found matching "${searchTerm}". Try searching by business name, industry, or plan ID.`
                  : "You haven't created any content plans yet. Generate your first plan using the Content Plan or Industry Plan tabs."
                }
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan ID</TableCell>
                      <TableCell>Business Name</TableCell>
                      <TableCell>Industry</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Platforms</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayPlans.map((plan) => (
                      <TableRow key={plan.id} hover>
                        <TableCell>
                          <Tooltip title={plan.id}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {plan.id.substring(0, 8)}...
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {plan.business_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={plan.industry} size="small" />
                        </TableCell>
                        <TableCell>{plan.plan_duration} days</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {plan.platforms?.slice(0, 2).map((platform, index) => (
                              <Chip 
                                key={index} 
                                label={platform.replace('_', ' ')} 
                                size="small" 
                                variant="outlined"
                              />
                            ))}
                            {plan.platforms?.length > 2 && (
                              <Tooltip title={plan.platforms.slice(2).join(', ')}>
                                <Chip 
                                  label={`+${plan.platforms.length - 2}`} 
                                  size="small" 
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={plan.status || 'active'} 
                            size="small"
                            color={
                              plan.status === 'active' ? 'success' :
                              plan.status === 'draft' ? 'warning' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Plan">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewPlan(plan)}
                                color="primary"
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Plan">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeletePlan(plan)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Social Media Content
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)} 
          sx={{ mb: 2 }}
          variant="fullWidth"
        >
          {[0, 1, 2,3].map(tabIndex => (
            <Tab 
              key={tabIndex}
              icon={getTabIcon(tabIndex)}
              label={getTabLabel(tabIndex)}
            />
          ))}
        </Tabs>

       <Alert severity="info" sx={{ mb: 2 }}>
          {activeTab === 0 && "Generate topic-based content in English, then translate to other languages."}
          {activeTab === 1 && "Generate comprehensive content plans in English, with translation support."}
          {activeTab === 2 && "Create industry-specific content plans in English, then translate as needed."}
          {activeTab === 3 && "Manage and view your saved content plans."}
        </Alert>

         {(activeTab === 0 || activeTab === 1 || activeTab === 2) && (
          <Card sx={{ mb: 2, p: 2, bgcolor: 'primary.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Language color="primary" />
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Content Generation
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Content is generated in English first. You can translate it to other languages after generation.
                </Typography>
              </Box>
            </Box>
          </Card>
        )}
        {/* Form fields for tabs 0, 1, 2 */}
        {(activeTab === 0 || activeTab === 1 || activeTab === 2) && (
          <Grid container spacing={2} alignItems="flex-end">
            {/* Topic Content Fields */}
            {activeTab === 0 && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Topic or Theme"
                    placeholder="digital marketing tips"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Industry"
                    placeholder="marketing"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Count"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    variant="outlined"
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={platform}
                      label="Platform"
                      onChange={(e) => setPlatform(e.target.value)}
                    >
                      <MenuItem value="all">All Platforms</MenuItem>
                      {availablePlatforms.map(platform => (
                        <MenuItem key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" gutterBottom>
                      Content Types:
                    </Typography>
                    <FormGroup row>
                      {availableContentTypes.map(type => (
                        <FormControlLabel
                          key={type}
                          control={
                            <Checkbox
                              checked={contentTypes.includes(type)}
                              onChange={() => handleContentTypeChange(type)}
                              name={type}
                            />
                          }
                          label={type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Content Plan Fields */}
            {(activeTab === 1 || activeTab === 2) && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    placeholder="Your Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    placeholder="healthcare, marketing, retail, etc."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Services/Products"
                    placeholder="Service 1, Service 2, Product 1"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    variant="outlined"
                    required
                    helperText="Separate multiple services with commas"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website URL (Optional)"
                    placeholder="https://yourbusiness.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                {activeTab === 2 && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Target Audience"
                        placeholder="Small business owners, young professionals, etc."
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Key Benefits"
                        placeholder="Fast delivery, affordable pricing, expert support"
                        value={keyBenefits}
                        onChange={(e) => setKeyBenefits(e.target.value)}
                        variant="outlined"
                        helperText="Separate benefits with commas"
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Plan Duration (Days)"
                    type="number"
                    value={planDuration}
                    onChange={(e) => setPlanDuration(parseInt(e.target.value) || 7)}
                    variant="outlined"
                    inputProps={{ min: 1, max: 30 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" gutterBottom>
                      Platforms:
                    </Typography>
                    <FormGroup row>
                      {['google_business', 'linkedin', 'instagram', 'facebook', 'twitter'].map(platform => (
                        <FormControlLabel
                          key={platform}
                          control={
                            <Checkbox
                              checked={selectedPlatforms.includes(platform)}
                              onChange={() => handlePlatformChange(platform)}
                              name={platform}
                            />
                          }
                          label={platform.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!isFormValid() || loading}
                startIcon={getTabIcon(activeTab)}
                size="large"
              >
                {loading ? 'Generating...' : 
                 activeTab === 0 ? 'Generate Topic Content' :
                 activeTab === 1 ? 'Generate Content Plan' :
                 activeTab === 2 ? 'Generate Industry Plan' : 'Generate Plan'}
              </Button>
            </Grid>
          </Grid>
        )}

        {/* My Plans tab doesn't need form fields */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="body1" color="textSecondary">
              View and manage your saved content plans. Click on the eye icon to view a plan or the delete icon to remove it.
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleGenerate} />
      )}

      {loading && <Loading message="Generating content..." />}

      {/* Results Rendering */}
      {data && activeTab === 0 && renderTopicContent()}
      {data && (activeTab === 1 || activeTab === 2) && renderContentPlan()}
      {activeTab === 3 && renderContentPlanManagement()}

      {/* View Plan Dialog */}
      <Dialog 
        open={viewPlanDialog} 
        onClose={() => setViewPlanDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Content Plan: {selectedPlan?.business_name}
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box>
              {/* You can reuse the renderContentPlan logic here */}
              <Typography variant="body1">
                This is where the detailed content plan view would go.
              </Typography>
              {/* Add detailed plan view components here */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPlanDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deletePlanDialog} 
        onClose={() => setDeletePlanDialog(false)}
      >
        <DialogTitle>Delete Content Plan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the content plan for "{planToDelete?.business_name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePlanDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContentSuggestions;