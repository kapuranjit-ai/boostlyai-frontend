// src/pages/AdCampaignManager.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Schedule as ScheduleIcon,
  PostAdd as PostAddIcon,
  TrendingUp as TrendingUpIcon,
//   Target as TargetIcon,
  Insights as InsightsIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  CalendarMonth as CalendarMonthIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Google as GoogleIcon,
 Tag as TagIcon, // Use Tag icon instead of Target
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Chat as ChatIcon

} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { seoAPI } from '../../services/api';

const AdCampaignManager = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [industries, setIndustries] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState({ platforms: [], goals: [] });
  const [contentTypes, setContentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Campaign form states
  const [campaignForm, setCampaignForm] = useState({
    industry: '',
    business_type: '',
    budget: '',
    goals: [],
    platforms: ['all']
  });

  const [multiPlatformForm, setMultiPlatformForm] = useState({
    industry: '',
    business_type: '',
    budget: '',
    goals: [],
    platforms: []
  });

  const [creativeForm, setCreativeForm] = useState({
    keywords: [''],
    platform: 'all'
  });

  const [feedForm, setFeedForm] = useState({
    industry: '',
    business_type: '',
    content_types: [],
    post_count: 7,
    platforms: ['all']
  });

  const [postForm, setPostForm] = useState({
    platform: 'facebook',
    content: { text: '' },
    image_url: '',
    schedule_time: null
  });

  const [scheduleForm, setScheduleForm] = useState({
    platform: 'facebook',
    content_calendar: [{ text: '' }],
    schedule_time: new Date()
  });

  // Results states
  const [campaignResult, setCampaignResult] = useState(null);
  const [multiPlatformResult, setMultiPlatformResult] = useState(null);
  const [creativesResult, setCreativesResult] = useState(null);
  const [feedResult, setFeedResult] = useState(null);
  const [platformConfig, setPlatformConfig] = useState(null);
  const [postingSchedule, setPostingSchedule] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [industriesRes, platformsRes, typesRes, contentRes] = await Promise.all([
        seoAPI.getAdIndustries(),
        seoAPI.getAdPlatforms(),
        seoAPI.getAdCampaignTypes(),
        seoAPI.getContentTypes()
      ]);
      
      setIndustries(industriesRes.data.industries);
      setPlatforms(platformsRes.data.platforms);
      setCampaignTypes(typesRes.data);
      setContentTypes(contentRes.data.content_types);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load campaign data. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Campaign generation functions
  const generateCampaign = async () => {
    if (!campaignForm.industry || !campaignForm.business_type || !campaignForm.budget || campaignForm.goals.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateAdCampaign(campaignForm);
      setCampaignResult(response.data);
      setSuccess('Campaign generated successfully!');
    } catch (err) {
      console.error('Error generating campaign:', err);
      setError(err.response?.data?.detail || 'Failed to generate campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMultiPlatformCampaign = async () => {
    if (!multiPlatformForm.industry || !multiPlatformForm.business_type || !multiPlatformForm.budget || 
        multiPlatformForm.goals.length === 0 || multiPlatformForm.platforms.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateMultiPlatformCampaign(multiPlatformForm);
      setMultiPlatformResult(response.data);
      setSuccess('Multi-platform campaign generated successfully!');
    } catch (err) {
      console.error('Error generating multi-platform campaign:', err);
      setError(err.response?.data?.detail || 'Failed to generate campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateCreatives = async () => {
    const validKeywords = creativeForm.keywords.filter(kw => kw.trim() !== '');
    if (validKeywords.length === 0) {
      setError('Please add at least one keyword');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateAdCreatives({
        keywords: validKeywords,
        platform: creativeForm.platform
      });
      setCreativesResult(response.data);
      setSuccess('Creatives generated successfully!');
    } catch (err) {
      console.error('Error generating creatives:', err);
      setError(err.response?.data?.detail || 'Failed to generate creatives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createSocialFeed = async () => {
    if (!feedForm.industry || !feedForm.business_type || feedForm.content_types.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.createSocialFeed(feedForm);
      setFeedResult(response.data);
      setSuccess('Social feed created successfully!');
    } catch (err) {
      console.error('Error creating social feed:', err);
      setError(err.response?.data?.detail || 'Failed to create social feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformConfig = async (platform) => {
    try {
      const response = await seoAPI.getPlatformConfig(platform);
      setPlatformConfig(response.data);
    } catch (err) {
      console.error('Error getting platform config:', err);
      setError('Failed to get platform configuration.');
    }
  };

  const getPostingSchedule = async () => {
    try {
      const response = await seoAPI.getPostingSchedule();
      setPostingSchedule(response.data);
    } catch (err) {
      console.error('Error getting posting schedule:', err);
      setError('Failed to get posting schedule.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Social Media Ad Campaign Manager
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} variant="scrollable">
        <Tab label="Platform Campaign" />
        {/* <Tab label="Multi-Platform Campaign" /> */}
        <Tab label="Creative Generator" />
        <Tab label="Social Feed Creator" />
        <Tab label="Platform Config" />
        <Tab label="Posting Schedule" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {activeTab === 0 && (
        <SinglePlatformCampaignTab
          form={campaignForm}
          setForm={setCampaignForm}
          industries={industries}
          campaignTypes={campaignTypes}
          platforms={platforms}
          loading={loading}
          result={campaignResult}
          onSubmit={generateCampaign}
          onCopy={copyToClipboard}
        />
      )}

      {/* {activeTab === 1 && (
        <MultiPlatformCampaignTab
          form={multiPlatformForm}
          setForm={setMultiPlatformForm}
          industries={industries}
          campaignTypes={campaignTypes}
          platforms={platforms}
          loading={loading}
          result={multiPlatformResult}
          onSubmit={generateMultiPlatformCampaign}
          onCopy={copyToClipboard}
        />
      )} */}

      {activeTab === 1 && (
        <CreativeGeneratorTab
          form={creativeForm}
          setForm={setCreativeForm}
          platforms={platforms}
          loading={loading}
          result={creativesResult}
          onSubmit={generateCreatives}
          onCopy={copyToClipboard}
        />
      )}

      {activeTab === 2 && (
        <SocialFeedTab
          form={feedForm}
          setForm={setFeedForm}
          industries={industries}
          contentTypes={contentTypes}
          loading={loading}
          result={feedResult}
          onSubmit={createSocialFeed}
          onCopy={copyToClipboard}
        />
      )}

      {activeTab === 3 && (
        <PlatformConfigTab
          platforms={platforms}
          config={platformConfig}
          onGetConfig={getPlatformConfig}
        />
      )}

      {activeTab === 4 && (
        <PostingScheduleTab
          schedule={postingSchedule}
          onGetSchedule={getPostingSchedule}
        />
      )}
    </Box>
  );
};

// Tab Components would be implemented here following the same pattern
// as the previous AdCampaignGenerator component, but adapted for each tab

// Tab Components for AdCampaignManager

// Single Platform Campaign Tab
const SinglePlatformCampaignTab = ({
  form,
  setForm,
  industries,
  campaignTypes,
  platforms,
  loading,
  result,
  onSubmit,
  onCopy
}) => {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalsChange = (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, goals: typeof value === 'string' ? value.split(',') : value }));
  };

  const handlePlatformsChange = (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, platforms: typeof value === 'string' ? value.split(',') : value }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Single Platform Campaign
          </Typography>

          <TextField
            select
            fullWidth
            label="Industry"
            value={form.industry}
            onChange={handleChange('industry')}
            sx={{ mb: 2 }}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Business Type"
            value={form.business_type}
            onChange={handleChange('business_type')}
            placeholder="e.g., B2C E-commerce, Local Service, SaaS Startup"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Budget ($)"
            type="number"
            value={form.budget}
            onChange={handleChange('budget')}
            placeholder="Enter your ad budget"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Campaign Goals</InputLabel>
            <Select
              multiple
              value={form.goals}
              onChange={handleGoalsChange}
              input={<OutlinedInput label="Campaign Goals" />}
              renderValue={(selected) => selected.map(goal => goal.charAt(0).toUpperCase() + goal.slice(1)).join(', ')}
            >
              {campaignTypes.goals.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  <Checkbox checked={form.goals.indexOf(goal) > -1} />
                  <ListItemText primary={goal.charAt(0).toUpperCase() + goal.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={form.platforms}
              onChange={handlePlatformsChange}
              input={<OutlinedInput label="Platforms" />}
              renderValue={(selected) => selected.map(platform => platform.charAt(0).toUpperCase() + platform.slice(1)).join(', ')}
            >
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  <Checkbox checked={form.platforms.indexOf(platform) > -1} />
                  <ListItemText primary={platform.charAt(0).toUpperCase() + platform.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            fullWidth
          >
            Generate Campaign
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <CampaignResults 
            result={result} 
            onCopy={onCopy}
          />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Fill out the form to generate AI-powered ad campaign suggestions
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Multi-Platform Campaign Tab
// const MultiPlatformCampaignTab = ({
//   form,
//   setForm,
//   industries,
//   campaignTypes,
//   platforms,
//   loading,
//   result,
//   onSubmit,
//   onCopy
// }) => {
//   const handleChange = (field) => (event) => {
//     const value = event.target.value;
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleGoalsChange = (event) => {
//     const value = event.target.value;
//     setForm(prev => ({ ...prev, goals: typeof value === 'string' ? value.split(',') : value }));
//   };

//   const handlePlatformsChange = (event) => {
//     const value = event.target.value;
//     setForm(prev => ({ ...prev, platforms: typeof value === 'string' ? value.split(',') : value }));
//   };

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12} md={6}>
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Multi-Platform Campaign
//           </Typography>

//           <TextField
//             select
//             fullWidth
//             label="Industry"
//             value={form.industry}
//             onChange={handleChange('industry')}
//             sx={{ mb: 2 }}
//           >
//             {industries.map((industry) => (
//               <MenuItem key={industry} value={industry}>
//                 {industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             label="Business Type"
//             value={form.business_type}
//             onChange={handleChange('business_type')}
//             placeholder="e.g., B2C E-commerce, Local Service, SaaS Startup"
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             label="Budget ($)"
//             type="number"
//             value={form.budget}
//             onChange={handleChange('budget')}
//             placeholder="Enter your ad budget"
//             InputProps={{
//               startAdornment: <InputAdornment position="start">$</InputAdornment>,
//             }}
//             sx={{ mb: 2 }}
//           />

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Campaign Goals</InputLabel>
//             <Select
//               multiple
//               value={form.goals}
//               onChange={handleGoalsChange}
//               input={<OutlinedInput label="Campaign Goals" />}
//               renderValue={(selected) => selected.map(goal => goal.charAt(0).toUpperCase() + goal.slice(1)).join(', ')}
//             >
//               {campaignTypes.goals.map((goal) => (
//                 <MenuItem key={goal} value={goal}>
//                   <Checkbox checked={form.goals.indexOf(goal) > -1} />
//                   <ListItemText primary={goal.charAt(0).toUpperCase() + goal.slice(1)} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth sx={{ mb: 3 }}>
//             <InputLabel>Platforms</InputLabel>
//             <Select
//               multiple
//               value={form.platforms}
//               onChange={handlePlatformsChange}
//               input={<OutlinedInput label="Platforms" />}
//               renderValue={(selected) => selected.map(platform => platform.charAt(0).toUpperCase() + platform.slice(1)).join(', ')}
//             >
//               {platforms.map((platform) => (
//                 <MenuItem key={platform} value={platform}>
//                   <Checkbox checked={form.platforms.indexOf(platform) > -1} />
//                   <ListItemText primary={platform.charAt(0).toUpperCase() + platform.slice(1)} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Button
//             variant="contained"
//             onClick={onSubmit}
//             disabled={loading}
//             startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
//             fullWidth
//           >
//             Generate Multi-Platform Campaign
//           </Button>
//         </Paper>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         {result ? (
//           <MultiPlatformResults 
//             result={result} 
//             onCopy={onCopy}
//           />
//         ) : (
//           <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Box>
//               <AnalyticsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
//               <Typography variant="body1" color="text.secondary">
//                 Fill out the form to generate multi-platform campaign suggestions
//               </Typography>
//             </Box>
//           </Paper>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// Creative Generator Tab
const CreativeGeneratorTab = ({
  form,
  setForm,
  platforms,
  loading,
  result,
  onSubmit,
  onCopy
}) => {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...form.keywords];
    newKeywords[index] = value;
    setForm(prev => ({ ...prev, keywords: newKeywords }));
  };

  const addKeywordField = () => {
    setForm(prev => ({ ...prev, keywords: [...prev.keywords, ''] }));
  };

  const removeKeywordField = (index) => {
    if (form.keywords.length > 1) {
      const newKeywords = form.keywords.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, keywords: newKeywords }));
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Creative Generator
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter keywords to generate targeted ad creatives
          </Typography>

          {form.keywords.map((keyword, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`Keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder="Enter a keyword"
              />
              {form.keywords.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeKeywordField(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={addKeywordField} sx={{ mb: 3 }}>
            Add Keyword
          </Button>

          <TextField
            select
            fullWidth
            label="Platform"
            value={form.platform}
            onChange={handleChange('platform')}
            sx={{ mb: 3 }}
          >
            {platforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            fullWidth
          >
            Generate Creatives
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        {result ? (
          <CreativeResults 
            result={result} 
            onCopy={onCopy}
          />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <EditIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Enter keywords to generate AI-powered ad creatives
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Social Feed Tab
const SocialFeedTab = ({
  form,
  setForm,
  industries,
  contentTypes,
  loading,
  result,
  onSubmit,
  onCopy
}) => {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContentTypesChange = (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, content_types: typeof value === 'string' ? value.split(',') : value }));
  };

  const handlePostCountChange = (event, newValue) => {
    setForm(prev => ({ ...prev, post_count: newValue }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Social Media Feed Creator
          </Typography>

          <TextField
            select
            fullWidth
            label="Industry"
            value={form.industry}
            onChange={handleChange('industry')}
            sx={{ mb: 2 }}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Business Type"
            value={form.business_type}
            onChange={handleChange('business_type')}
            placeholder="e.g., B2C E-commerce, Local Service, SaaS Startup"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Content Types</InputLabel>
            <Select
              multiple
              value={form.content_types}
              onChange={handleContentTypesChange}
              input={<OutlinedInput label="Content Types" />}
              renderValue={(selected) => selected.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
            >
              {contentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={form.content_types.indexOf(type) > -1} />
                  <ListItemText primary={type.charAt(0).toUpperCase() + type.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Number of Posts: {form.post_count}</Typography>
            <Slider
              value={form.post_count}
              onChange={handlePostCountChange}
              min={1}
              max={30}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 7, label: '7' },
                { value: 14, label: '14' },
                { value: 21, label: '21' },
                { value: 30, label: '30' }
              ]}
            />
          </Box>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            fullWidth
          >
            Create Social Feed
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <SocialFeedResults 
            result={result} 
            onCopy={onCopy}
          />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <PostAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Fill out the form to generate a social media content feed
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Platform Config Tab
const PlatformConfigTab = ({
  platforms,
  config,
  onGetConfig
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handlePlatformChange = (event) => {
    const platform = event.target.value;
    setSelectedPlatform(platform);
    if (platform) {
      onGetConfig(platform);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FacebookIcon />;
      case 'twitter': return <TwitterIcon />;
      case 'linkedin': return <LinkedInIcon />;
      case 'instagram': return <InstagramIcon />;
      case 'youtube': return <YouTubeIcon />;
      default: return <SettingsIcon />;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Platform Configuration
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Platform"
            value={selectedPlatform}
            onChange={handlePlatformChange}
            sx={{ mb: 3 }}
          >
            {platforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getPlatformIcon(platform)}
                  <Typography sx={{ ml: 1 }}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {!selectedPlatform && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Select a platform to view its configuration details
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        {config ? (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getPlatformIcon(config.platform)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {config.platform.charAt(0).toUpperCase() + config.platform.slice(1)} Configuration
              </Typography>
            </Box>

            {config.supported ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Character Limits</Typography>
                {config.config.character_limits && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {Object.entries(config.config.character_limits).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Chip 
                          label={`${key}: ${value}`} 
                          variant="outlined" 
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {config.config.image_aspect_ratios && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Image Aspect Ratios</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {config.config.image_aspect_ratios.map((ratio) => (
                        <Chip key={ratio} label={ratio} variant="outlined" />
                      ))}
                    </Box>
                  </>
                )}

                {config.config.video_limits && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Video Limits</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(config.config.video_limits).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                          <Chip 
                            label={`${key}: ${value}`} 
                            variant="outlined" 
                            sx={{ mb: 1 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Box>
            ) : (
              <Alert severity="warning">
                Configuration not available for {config.platform}
              </Alert>
            )}
          </Paper>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <SettingsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Select a platform to view its configuration details
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Posting Schedule Tab
const PostingScheduleTab = ({
  schedule,
  onGetSchedule
}) => {
  useEffect(() => {
    onGetSchedule();
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FacebookIcon />;
      case 'twitter': return <TwitterIcon />;
      case 'linkedin': return <LinkedInIcon />;
      case 'instagram': return <InstagramIcon />;
      case 'youtube': return <YouTubeIcon />;
      default: return <ScheduleIcon />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Optimal Posting Schedule</Typography>
        <Button 
          variant="outlined" 
          onClick={onGetSchedule}
          startIcon={<ScheduleIcon />}
        >
          Refresh Schedule
        </Button>
      </Box>

      {schedule ? (
        <Grid container spacing={3}>
          {schedule.schedule && Object.entries(schedule.schedule).map(([platform, platformSchedule]) => (
            <Grid item xs={12} md={6} key={platform}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getPlatformIcon(platform)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Typography>
                  </Box>

                  {platformSchedule.best_times && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Best Times to Post</Typography>
                      <Box sx={{ mb: 2 }}>
                        {platformSchedule.best_times.map((time, index) => (
                          <Chip 
                            key={index} 
                            label={time} 
                            size="small" 
                            sx={{ mr: 1, mb: 1 }}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {platformSchedule.best_days && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Best Days to Post</Typography>
                      <Box sx={{ mb: 2 }}>
                        {platformSchedule.best_days.map((day, index) => (
                          <Chip 
                            key={index} 
                            label={day} 
                            size="small" 
                            sx={{ mr: 1, mb: 1 }}
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {platformSchedule.frequency && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Recommended Frequency</Typography>
                      <Typography variant="body2">{platformSchedule.frequency}</Typography>
                    </>
                  )}

                  {platformSchedule.optimal_content_types && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Optimal Content Types</Typography>
                      <Box>
                        {platformSchedule.optimal_content_types.map((type, index) => (
                          <Chip 
                            key={index} 
                            label={type} 
                            size="small" 
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading posting schedule...
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

// Result Display Components
// Updated CampaignResults Component
// Updated CampaignResults Component with proper error handling
const CampaignResults = ({ result, onCopy }) => {
  if (!result || !result.success) {
    return (
      <Alert severity="error">
        Failed to generate campaign. Please try again.
      </Alert>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FacebookIcon sx={{ color: '#1877F2' }} />;
      case 'google': return <GoogleIcon sx={{ color: '#EA4335' }} />;
      case 'youtube': return <YouTubeIcon sx={{ color: '#FF0000' }} />;
      case 'twitter': return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'linkedin': return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'instagram': return <InstagramIcon sx={{ color: '#E4405F' }} />;
      default: return <AnalyticsIcon />;
    }
  };

  const renderPlatformCampaign = (platform, campaign) => {
    if (!campaign) return null;
    
    return (
      <Accordion key={platform}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getPlatformIcon(platform)}
            <Typography sx={{ ml: 1, fontWeight: 'bold' }}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)} Campaign
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Campaign Details */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Campaign Details</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {campaign.campaign_type || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Objective:</strong> {campaign.objective || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Daily Budget:</strong> {campaign.daily_budget || 'N/A'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Bidding Strategy - Only show if it exists */}
            {campaign.bidding_strategy && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>Bidding Strategy</Typography>
                    <Typography variant="body2"><strong>{campaign.bidding_strategy.strategy || 'N/A'}:</strong></Typography>
                    <Typography variant="body2">{campaign.bidding_strategy.description || 'No description available'}</Typography>
                    <Typography variant="body2"><strong>Best for:</strong> {campaign.bidding_strategy.best_for || 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Targeting Suggestions */}
            {campaign.targeting_suggestions && campaign.targeting_suggestions.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Targeting Suggestions</Typography>
                <Grid container spacing={2}>
                  {campaign.targeting_suggestions.map((targeting, index) => (
                    targeting && targeting.suggestions && (
                      <Grid item xs={12} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2">
                              {targeting.audience_type || targeting.audence_type || 'Targeting'}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {targeting.suggestions.map((suggestion, i) => (
                                <Chip key={i} label={suggestion} size="small" sx={{ m: 0.5 }} />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Ad Creatives */}
            {campaign.ad_creatives && campaign.ad_creatives.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Ad Creatives</Typography>
                <Grid container spacing={2}>
                  {campaign.ad_creatives.map((creative, index) => (
                    creative && (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                              <Chip label={creative.template_type || 'Creative'} size="small" />
                              <IconButton 
                                size="small" 
                                onClick={() => onCopy(`${creative.headline || ''}\n\n${creative.text || ''}`)}
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </Box>
                            {creative.headline && (
                              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {creative.headline}
                              </Typography>
                            )}
                            {creative.text && (
                              <Typography variant="body2" gutterBottom>
                                {creative.text}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              {creative.cta && (
                                <Chip label={`CTA: ${creative.cta}`} size="small" color="primary" />
                              )}
                              {creative.image_suggestion && (
                                <Typography variant="caption" color="text.secondary">
                                  Image: {creative.image_suggestion}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Keyword Suggestions */}
            {campaign.keyword_suggestions && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Keyword Suggestions</Typography>
                <Grid container spacing={2}>
                  {campaign.keyword_suggestions.head_keywords && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Head Keywords</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {campaign.keyword_suggestions.head_keywords.map((keyword, i) => (
                          <Chip key={i} label={keyword} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  {campaign.keyword_suggestions.long_tail_keywords && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Long-tail Keywords</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {campaign.keyword_suggestions.long_tail_keywords.slice(0, 5).map((keyword, i) => (
                          <Chip key={i} label={keyword} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  {campaign.keyword_suggestions.negative_keywords && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Negative Keywords</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {campaign.keyword_suggestions.negative_keywords.map((keyword, i) => (
                          <Chip key={i} label={keyword} size="small" color="error" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

            {/* Video Ideas */}
            {campaign.video_ideas && campaign.video_ideas.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Video Ideas</Typography>
                <Grid container spacing={2}>
                  {campaign.video_ideas.map((video, index) => (
                    video && (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            {video.template_type && (
                              <Chip label={video.template_type} size="small" sx={{ mb: 1 }} />
                            )}
                            {video.video_script && (
                              <Typography variant="body2" gutterBottom><strong>Script:</strong> {video.video_script}</Typography>
                            )}
                            {video.thumbnail_text && (
                              <Typography variant="body2" gutterBottom><strong>Thumbnail:</strong> {video.thumbnail_text}</Typography>
                            )}
                            {video.description && (
                              <Typography variant="body2" gutterBottom><strong>Description:</strong> {video.description}</Typography>
                            )}
                            {video.cta && (
                              <Chip label={`CTA: ${video.cta}`} size="small" color="primary" />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Tweet Variations */}
            {campaign.tweet_variations && campaign.tweet_variations.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Tweet Variations</Typography>
                <Grid container spacing={2}>
                  {campaign.tweet_variations.map((tweet, index) => (
                    tweet && (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            {tweet.template_type && (
                              <Chip label={tweet.template_type} size="small" sx={{ mb: 1 }} />
                            )}
                            {tweet.tweet_text && (
                              <Typography variant="body2" gutterBottom>{tweet.tweet_text}</Typography>
                            )}
                            {tweet.hashtags && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
                                {tweet.hashtags.map((hashtag, i) => (
                                  <Chip key={i} label={hashtag} size="small" variant="outlined" />
                                ))}
                              </Box>
                            )}
                            {tweet.thread_suggestion && (
                              <Typography variant="caption" display="block" gutterBottom>
                                {tweet.thread_suggestion}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Post Variations */}
            {campaign.post_variations && campaign.post_variations.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Post Variations</Typography>
                <Grid container spacing={2}>
                  {campaign.post_variations.map((post, index) => (
                    post && (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            {post.template_type && (
                              <Chip label={post.template_type} size="small" sx={{ mb: 1 }} />
                            )}
                            {post.post_text && (
                              <Typography variant="body2" gutterBottom>{post.post_text}</Typography>
                            )}
                            {post.hashtags && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
                                {post.hashtags.map((hashtag, i) => (
                                  <Chip key={i} label={hashtag} size="small" variant="outlined" />
                                ))}
                              </Box>
                            )}
                            {post.cta && (
                              <Chip label={`CTA: ${post.cta}`} size="small" color="primary" />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Content Ideas */}
            {campaign.content_ideas && campaign.content_ideas.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Content Ideas</Typography>
                <Grid container spacing={2}>
                  {campaign.content_ideas.map((content, index) => (
                    content && (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            {content.template_type && (
                              <Chip label={content.template_type} size="small" sx={{ mb: 1 }} />
                            )}
                            {content.caption && (
                              <Typography variant="body2" gutterBottom>{content.caption}</Typography>
                            )}
                            {content.hashtags && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
                                {content.hashtags.map((hashtag, i) => (
                                  <Chip key={i} label={hashtag} size="small" variant="outlined" />
                                ))}
                              </Box>
                            )}
                            {content.story_idea && (
                              <Typography variant="body2" gutterBottom><strong>Story Idea:</strong> {content.story_idea}</Typography>
                            )}
                            {content.cta && (
                              <Chip label={`CTA: ${content.cta}`} size="small" color="primary" />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Campaign Results for {result.industry ? result.industry.replace(/_/g, ' ').toUpperCase() : 'SaaS'}
      </Typography>

      {/* AI Insights */}
      {result.ai_insights && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TipsAndUpdatesIcon sx={{ mr: 1 }} />
              <Typography>AI Insights & Trends</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {result.ai_insights.trends && (
              <>
                <Typography variant="subtitle1" gutterBottom>Recent Trends</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {result.ai_insights.trends}
                </Typography>
              </>
            )}
            {result.ai_insights.best_practices && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Best Practices</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {result.ai_insights.best_practices}
                </Typography>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Enhanced Keywords */}
      {result.enhanced_keywords && result.enhanced_keywords.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TagIcon sx={{ mr: 1 }} />
              <Typography>Enhanced Keywords</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {result.enhanced_keywords.map((keyword, index) => (
                <Chip key={index} label={keyword} size="small" variant="outlined" />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Platform Campaigns */}
      {result.facebook_campaign && renderPlatformCampaign('facebook', result.facebook_campaign)}
      {result.google_campaign && renderPlatformCampaign('google', result.google_campaign)}
      {result.youtube_campaign && renderPlatformCampaign('youtube', result.youtube_campaign)}
      {result.twitter_campaign && renderPlatformCampaign('twitter', result.twitter_campaign)}
      {result.linkedin_campaign && renderPlatformCampaign('linkedin', result.linkedin_campaign)}
      {result.instagram_campaign && renderPlatformCampaign('instagram', result.instagram_campaign)}

      {/* Cross-Platform Strategy */}
      {result.cross_platform_strategy && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              <Typography>Cross-Platform Strategy</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>Overall Strategy</Typography>
            <Typography variant="body2">{result.cross_platform_strategy.strategy || 'N/A'}</Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {result.cross_platform_strategy && Object.entries(result.cross_platform_strategy).map(([key, value]) => {
                if (key !== 'strategy' && typeof value === 'string') {
                  return (
                    <Grid item xs={12} md={6} key={key}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Typography variant="body2">{value}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Performance Metrics */}
      {result.performance_metrics && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsightsIcon sx={{ mr: 1 }} />
              <Typography>Performance Metrics</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {result.performance_metrics.expected_cpc && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Expected CPC</Typography>
                  <Typography variant="body1">{result.performance_metrics.expected_cpc}</Typography>
                </Grid>
              )}
              {result.performance_metrics.expected_ctr && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Expected CTR</Typography>
                  <Typography variant="body1">{result.performance_metrics.expected_ctr}</Typography>
                </Grid>
              )}
              {result.performance_metrics.expected_conversion_rate && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Conversion Rate</Typography>
                  <Typography variant="body1">{result.performance_metrics.expected_conversion_rate}</Typography>
                </Grid>
              )}
              {result.performance_metrics.estimated_weekly_results && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Estimated Weekly Results</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.performance_metrics.estimated_weekly_results.clicks || 0}</Typography>
                          <Typography variant="body2">Clicks</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.performance_metrics.estimated_weekly_results.conversions || 0}</Typography>
                          <Typography variant="body2">Conversions</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">${result.performance_metrics.estimated_weekly_results.cost_per_conversion || 0}</Typography>
                          <Typography variant="body2">Cost/Conv</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Optimization Tips */}
      {result.optimization_tips && result.optimization_tips.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TipsAndUpdatesIcon sx={{ mr: 1 }} />
              <Typography>Optimization Tips</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {result.optimization_tips.map((tip, index) => (
              tip && (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    {tip.phase || `Phase ${index + 1}`}
                  </Typography>
                  {tip.actions && tip.actions.length > 0 && (
                    <List dense>
                      {tip.actions.map((action, i) => (
                        <ListItem key={i}>
                          <ListItemIcon>•</ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {index < result.optimization_tips.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              )
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

// const MultiPlatformResults = ({ result, onCopy }) => {
//   if (!result || !result.success) {
//     return (
//       <Alert severity="error">
//         Failed to generate multi-platform campaign. Please try again.
//       </Alert>
//     );
//   }

//   return (
//     <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
//       <Typography variant="h5" gutterBottom>
//         Multi-Platform Campaign Results
//       </Typography>
//       <Typography variant="body1">
//         Multi-platform campaign generated successfully. This would display the campaign details.
//       </Typography>
//     </Box>
//   );
// };

// Updated CreativeResults Component for generate-creatives endpoint
const CreativeResults = ({ result, onCopy }) => {
  if (!result || !result.success) {
    return (
      <Alert severity="error">
        Failed to generate creatives. Please try again.
      </Alert>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'google': return <GoogleIcon sx={{ color: '#EA4335' }} />;
      case 'facebook': return <FacebookIcon sx={{ color: '#1877F2' }} />;
      case 'youtube': return <YouTubeIcon sx={{ color: '#FF0000' }} />;
      case 'twitter': return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'linkedin': return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'instagram': return <InstagramIcon sx={{ color: '#E4405F' }} />;
      default: return <AnalyticsIcon />;
    }
  };

  const renderPlatformCreatives = (platform, creatives) => {
    if (!creatives || creatives.length === 0) return null;
    
    return (
      <Accordion key={platform} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getPlatformIcon(platform)}
            <Typography sx={{ ml: 1, fontWeight: 'bold' }}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)} Creatives
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {creatives.map((creative, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={creative.keyword || `Creative ${index + 1}`} 
                        color="primary" 
                        size="small" 
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => onCopy(
                          `${creative.headline1 || ''}\n${creative.headline2 || ''}\n${creative.headline3 || ''}\n\n${creative.description || ''}`
                        )}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>

                    {/* Headlines */}
                    {creative.headline1 && (
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {creative.headline1}
                      </Typography>
                    )}
                    {creative.headline2 && (
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {creative.headline2}
                      </Typography>
                    )}
                    {creative.headline3 && (
                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
                        {creative.headline3}
                      </Typography>
                    )}

                    {/* Description */}
                    {creative.description && (
                      <Typography variant="body2" sx={{ my: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                        {creative.description}
                      </Typography>
                    )}

                    {/* CTA and URL */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      {creative.cta && (
                        <Button variant="contained" size="small" color="primary">
                          {creative.cta}
                        </Button>
                      )}
                      {creative.final_url_suggestion && (
                        <Typography variant="caption" color="text.secondary">
                          URL: {creative.final_url_suggestion}
                        </Typography>
                      )}
                    </Box>

                    {/* Performance Metrics (if available) */}
                    {creative.expected_ctr && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="caption" display="block">
                          Expected CTR: {creative.expected_ctr}
                        </Typography>
                        {creative.quality_score && (
                          <Typography variant="caption" display="block">
                            Quality Score: {creative.quality_score}/10
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Generated Ad Creatives
      </Typography>

      {/* Platform-specific creatives */}
      {result.google_creatives && renderPlatformCreatives('google', result.google_creatives)}
      {result.facebook_creatives && renderPlatformCreatives('facebook', result.facebook_creatives)}
      {result.youtube_creatives && renderPlatformCreatives('youtube', result.youtube_creatives)}
      {result.twitter_creatives && renderPlatformCreatives('twitter', result.twitter_creatives)}
      {result.linkedin_creatives && renderPlatformCreatives('linkedin', result.linkedin_creatives)}
      {result.instagram_creatives && renderPlatformCreatives('instagram', result.instagram_creatives)}

      {/* Generic creatives (if no platform-specific) */}
      {result.creatives && !result.google_creatives && !result.facebook_creatives && 
       !result.youtube_creatives && !result.twitter_creatives && 
       !result.linkedin_creatives && !result.instagram_creatives && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography>Generated Creatives</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {result.creatives.map((creative, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip 
                          label={creative.platform ? `${creative.platform} - ${creative.ad_type || 'Ad'}` : `Creative ${index + 1}`} 
                          color="primary" 
                          size="small" 
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => onCopy(
                            `${creative.headline || ''}\n\n${creative.description || ''}`
                          )}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>

                      {creative.headline && (
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {creative.headline}
                        </Typography>
                      )}

                      {creative.description && (
                        <Typography variant="body2" sx={{ my: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          {creative.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        {creative.cta && (
                          <Button variant="contained" size="small" color="primary">
                            {creative.cta}
                          </Button>
                        )}
                        {creative.final_url && (
                          <Typography variant="caption" color="text.secondary">
                            URL: {creative.final_url}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Performance Summary */}
      {(result.performance_metrics || result.estimated_results) && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsightsIcon sx={{ mr: 1 }} />
              <Typography>Performance Summary</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {result.performance_metrics && (
                <>
                  {result.performance_metrics.expected_ctr && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.performance_metrics.expected_ctr}</Typography>
                          <Typography variant="body2">Expected CTR</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {result.performance_metrics.quality_score && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.performance_metrics.quality_score}/10</Typography>
                          <Typography variant="body2">Quality Score</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {result.performance_metrics.relevance_score && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.performance_metrics.relevance_score}/10</Typography>
                          <Typography variant="body2">Relevance Score</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              )}

              {result.estimated_results && (
                <>
                  {result.estimated_results.estimated_clicks && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.estimated_results.estimated_clicks}</Typography>
                          <Typography variant="body2">Estimated Clicks</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {result.estimated_results.estimated_conversions && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">{result.estimated_results.estimated_conversions}</Typography>
                          <Typography variant="body2">Estimated Conversions</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {result.estimated_results.cost_per_conversion && (
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">${result.estimated_results.cost_per_conversion}</Typography>
                          <Typography variant="body2">Cost per Conversion</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TipsAndUpdatesIcon sx={{ mr: 1 }} />
              <Typography>Optimization Recommendations</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {result.recommendations.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>•</ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

// Updated SocialFeedResults Component
const SocialFeedResults = ({ result, onCopy }) => {
  if (!result || !result.success) {
    return (
      <Alert severity="error">
        Failed to generate social feed. Please try again.
      </Alert>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FacebookIcon sx={{ color: '#1877F2' }} />;
      case 'instagram': return <InstagramIcon sx={{ color: '#E4405F' }} />;
      case 'twitter': return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'linkedin': return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'youtube': return <YouTubeIcon sx={{ color: '#FF0000' }} />;
      default: return <PostAddIcon />;
    }
  };

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'educational': return <TipsAndUpdatesIcon color="info" />;
      case 'promotional': return <TrendingUpIcon color="primary" />;
      case 'engagement': return <ChatIcon color="secondary" />;
      case 'testimonial': return <StarIcon color="warning" />;
      case 'behind_scenes': return <VisibilityIcon color="action" />;
      default: return <PostAddIcon />;
    }
  };

  const renderContentCalendar = () => {
    if (!result.content_calendar || result.content_calendar.length === 0) {
      return (
        <Alert severity="info">
          No content calendar available.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {result.content_calendar.map((dayContent, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Day {dayContent.day}: {dayContent.content_type?.charAt(0).toUpperCase() + dayContent.content_type?.slice(1)} Content
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getContentTypeIcon(dayContent.content_type)}
                      <Chip 
                        label={dayContent.content_type} 
                        size="small" 
                        sx={{ ml: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => onCopy(dayContent.content)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>

                {/* Platform Suggestions */}
                {dayContent.platform_suggestions && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Platform Suggestions</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2"><strong>Primary:</strong></Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {dayContent.platform_suggestions.primary?.map((platform, i) => (
                            <Chip 
                              key={i} 
                              label={platform} 
                              size="small" 
                              icon={getPlatformIcon(platform)}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2"><strong>Secondary:</strong></Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {dayContent.platform_suggestions.secondary?.map((platform, i) => (
                            <Chip 
                              key={i} 
                              label={platform} 
                              size="small" 
                              icon={getPlatformIcon(platform)}
                              variant="outlined"
                              color="default"
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2"><strong>Format:</strong></Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {dayContent.platform_suggestions.format?.map((format, i) => (
                            <Chip key={i} label={format} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Content */}
                {dayContent.content && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Content</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', maxHeight: '200px', overflow: 'auto' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {dayContent.content}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Hashtags */}
                {dayContent.hashtags && dayContent.hashtags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Hashtags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {dayContent.hashtags.map((hashtag, i) => (
                        <Chip key={i} label={hashtag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Visual Suggestion */}
                {dayContent.visual_suggestion && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Visual Suggestion</Typography>
                    <Chip 
                      label={dayContent.visual_suggestion} 
                      size="small" 
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderPostingSchedule = () => {
    if (!result.posting_schedule) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            <Typography>Posting Schedule & Strategy</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Best Times */}
            {result.posting_schedule.best_times && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Best Posting Times</Typography>
                <Card variant="outlined">
                  <CardContent>
                    {Object.entries(result.posting_schedule.best_times).map(([platform, time]) => (
                      <Box key={platform} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getPlatformIcon(platform)}
                        <Typography variant="body2" sx={{ ml: 1, flexGrow: 1 }}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {time}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Frequency */}
            {result.posting_schedule.frequency && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Posting Frequency</Typography>
                <Card variant="outlined">
                  <CardContent>
                    {Object.entries(result.posting_schedule.frequency).map(([platform, frequency]) => (
                      <Box key={platform} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getPlatformIcon(platform)}
                        <Typography variant="body2" sx={{ ml: 1, flexGrow: 1 }}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {frequency}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Optimal Content Mix */}
            {result.posting_schedule.optimal_mix && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Optimal Content Mix</Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      {Object.entries(result.posting_schedule.optimal_mix).map(([type, percentage]) => (
                        <Grid item xs={12} sm={6} md={4} key={type}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getContentTypeIcon(type)}
                            <Box sx={{ ml: 1, flexGrow: 1 }}>
                              <Typography variant="body2">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={parseInt(percentage)} 
                                sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {percentage}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderContentMix = () => {
    if (!result.content_mix) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon sx={{ mr: 1 }} />
            <Typography>Content Mix Analysis</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Content Distribution */}
            {result.content_mix.content_distribution && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Content Distribution</Typography>
                <Card variant="outlined">
                  <CardContent>
                    {Object.entries(result.content_mix.content_distribution).map(([type, percentage]) => (
                      <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getContentTypeIcon(type)}
                        <Box sx={{ ml: 1, flexGrow: 1 }}>
                          <Typography variant="body2">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={parseInt(percentage)} 
                            sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {percentage}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Recommended Adjustments */}
            {result.content_mix.recommended_adjustments && result.content_mix.recommended_adjustments.length > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Recommended Adjustments</Typography>
                <Card variant="outlined">
                  <CardContent>
                    <List>
                      {result.content_mix.recommended_adjustments.map((adjustment, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TipsAndUpdatesIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={adjustment} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Social Media Content Calendar - {result.feed_duration}
      </Typography>

      {/* Content Calendar */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ mr: 1 }} />
            <Typography>Daily Content ({result.content_calendar?.length || 0} days)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderContentCalendar()}
        </AccordionDetails>
      </Accordion>

      {/* Posting Schedule */}
      {renderPostingSchedule()}

      {/* Content Mix Analysis */}
      {renderContentMix()}

      {/* Export Options */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Export Options</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => onCopy(JSON.stringify(result, null, 2))}>
            Copy JSON
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download CSV
          </Button>
          <Button variant="outlined" startIcon={<CalendarMonthIcon />}>
            Add to Calendar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};


// SinglePlatformCampaignTab, MultiPlatformCampaignTab, CreativeGeneratorTab,
// SocialFeedTab, PlatformConfigTab, and PostingScheduleTab components
// would be implemented with forms and result displays specific to each endpoint

export default AdCampaignManager;