// src/pages/AdCampaignGenerator.js
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
  ListItemIcon
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  Facebook as FacebookIcon,
  Google as GoogleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Target as TargetIcon,
  Insights as InsightsIcon,
  TipsAndUpdates as TipsAndUpdatesIcon
} from '@mui/icons-material';
import { seoAPI } from '../../services/api';

const AdCampaignGenerator = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [industries, setIndustries] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState({ platforms: [], goals: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [campaignResult, setCampaignResult] = useState(null);
  const [creativesResult, setCreativesResult] = useState(null);
  const [previewCreative, setPreviewCreative] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    industry: '',
    business_type: '',
    budget: '',
    goals: [],
    platform: 'both'
  });

  // Creative form state
  const [creativeForm, setCreativeForm] = useState({
    keywords: [''],
    platform: 'both'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [industriesRes, typesRes] = await Promise.all([
        seoAPI.getAdIndustries(),
        seoAPI.getAdCampaignTypes()
      ]);
      
      setIndustries(industriesRes.data.industries);
      setCampaignTypes(typesRes.data);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load campaign data. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCampaignFormChange = (field) => (event) => {
    const value = event.target.value;
    setCampaignForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalsChange = (event) => {
    const value = event.target.value;
    setCampaignForm(prev => ({
      ...prev,
      goals: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleCreativeFormChange = (field) => (event) => {
    const value = event.target.value;
    setCreativeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...creativeForm.keywords];
    newKeywords[index] = value;
    setCreativeForm(prev => ({
      ...prev,
      keywords: newKeywords
    }));
  };

  const addKeywordField = () => {
    setCreativeForm(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const removeKeywordField = (index) => {
    if (creativeForm.keywords.length > 1) {
      const newKeywords = creativeForm.keywords.filter((_, i) => i !== index);
      setCreativeForm(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    }
  };

  const generateCampaign = async () => {
    if (!campaignForm.industry || !campaignForm.business_type || !campaignForm.budget || campaignForm.goals.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.generateAdCampaign({
        industry: campaignForm.industry,
        business_type: campaignForm.business_type,
        budget: parseFloat(campaignForm.budget),
        goals: campaignForm.goals,
        platform: campaignForm.platform
      });

      setCampaignResult(response.data);
      setSuccess('Campaign generated successfully!');
    } catch (err) {
      console.error('Error generating campaign:', err);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  const previewCreativeAd = (creative) => {
    setPreviewCreative(creative);
    setPreviewOpen(true);
  };

  const resetForms = () => {
    setCampaignForm({
      industry: '',
      business_type: '',
      budget: '',
      goals: [],
      platform: 'both'
    });
    setCreativeForm({
      keywords: [''],
      platform: 'both'
    });
    setCampaignResult(null);
    setCreativesResult(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Ad Campaign Generator
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Campaign Generator" />
        <Tab label="Creative Generator" />
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

      {activeTab === 0 ? (
        <CampaignGeneratorTab
          campaignForm={campaignForm}
          industries={industries}
          campaignTypes={campaignTypes}
          loading={loading}
          campaignResult={campaignResult}
          onChange={handleCampaignFormChange}
          onGoalsChange={handleGoalsChange}
          onSubmit={generateCampaign}
          onReset={resetForms}
          onCopy={copyToClipboard}
          onPreview={previewCreativeAd}
        />
      ) : (
        <CreativeGeneratorTab
          creativeForm={creativeForm}
          campaignTypes={campaignTypes}
          loading={loading}
          creativesResult={creativesResult}
          onChange={handleCreativeFormChange}
          onKeywordChange={handleKeywordChange}
          onAddKeyword={addKeywordField}
          onRemoveKeyword={removeKeywordField}
          onSubmit={generateCreatives}
          onReset={resetForms}
          onCopy={copyToClipboard}
          onPreview={previewCreativeAd}
        />
      )}

      <CreativePreviewDialog
        open={previewOpen}
        creative={previewCreative}
        onClose={() => setPreviewOpen(false)}
      />
    </Box>
  );
};

// Campaign Generator Tab Component
const CampaignGeneratorTab = ({
  campaignForm,
  industries,
  campaignTypes,
  loading,
  campaignResult,
  onChange,
  onGoalsChange,
  onSubmit,
  onReset,
  onCopy,
  onPreview
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Campaign Details
          </Typography>

          <TextField
            select
            fullWidth
            label="Industry"
            value={campaignForm.industry}
            onChange={onChange('industry')}
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
            value={campaignForm.business_type}
            onChange={onChange('business_type')}
            placeholder="e.g., B2C E-commerce, Local Service, SaaS Startup"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Budget ($)"
            type="number"
            value={campaignForm.budget}
            onChange={onChange('budget')}
            placeholder="Enter your ad budget"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Campaign Goals</InputLabel>
            <Select
              multiple
              value={campaignForm.goals}
              onChange={onGoalsChange}
              input={<OutlinedInput label="Campaign Goals" />}
              renderValue={(selected) => selected.map(goal => goal.charAt(0).toUpperCase() + goal.slice(1)).join(', ')}
            >
              {campaignTypes.goals.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  <Checkbox checked={campaignForm.goals.indexOf(goal) > -1} />
                  <ListItemText primary={goal.charAt(0).toUpperCase() + goal.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            select
            fullWidth
            label="Platform"
            value={campaignForm.platform}
            onChange={onChange('platform')}
            sx={{ mb: 3 }}
          >
            {campaignTypes.platforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform === 'both' ? 'Both Facebook & Google' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              Generate Campaign
            </Button>
            <Button variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {campaignResult ? (
          <CampaignResults 
            result={campaignResult} 
            onCopy={onCopy}
            onPreview={onPreview}
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

// Creative Generator Tab Component
const CreativeGeneratorTab = ({
  creativeForm,
  campaignTypes,
  loading,
  creativesResult,
  onChange,
  onKeywordChange,
  onAddKeyword,
  onRemoveKeyword,
  onSubmit,
  onReset,
  onCopy,
  onPreview
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Creative Details
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter keywords to generate targeted ad creatives
          </Typography>

          {creativeForm.keywords.map((keyword, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`Keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => onKeywordChange(index, e.target.value)}
                placeholder="Enter a keyword"
              />
              {creativeForm.keywords.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onRemoveKeyword(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={onAddKeyword} sx={{ mb: 3 }}>
            Add Keyword
          </Button>

          <TextField
            select
            fullWidth
            label="Platform"
            value={creativeForm.platform}
            onChange={onChange('platform')}
            sx={{ mb: 3 }}
          >
            {campaignTypes.platforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform === 'both' ? 'Both Facebook & Google' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              Generate Creatives
            </Button>
            <Button variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        {creativesResult ? (
          <CreativeResults 
            result={creativesResult} 
            onCopy={onCopy}
            onPreview={onPreview}
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

// Campaign Results Component - UPDATED FOR NEW JSON FORMAT
const CampaignResults = ({ result, onCopy, onPreview }) => {
  if (!result || !result.success) {
    return (
      <Alert severity="error">
        Failed to generate campaign. Please try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Campaign Results for {result.industry.replace(/_/g, ' ').toUpperCase()}
      </Typography>

      {/* Cross-Platform Strategy */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            <Typography>Cross-Platform Strategy</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <FacebookIcon sx={{ mr: 1, color: '#1877F2' }} />
                    Facebook
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Budget:</strong> {result.facebook_campaign.daily_budget}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Objective:</strong> {result.facebook_campaign.objective}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {result.facebook_campaign.campaign_type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <GoogleIcon sx={{ mr: 1, color: '#EA4335' }} />
                    Google
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Budget:</strong> {result.google_campaign.daily_budget}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Objective:</strong> {result.google_campaign.objective}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {result.google_campaign.campaign_type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Overall Strategy: {result.cross_platform_strategy.strategy}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Facebook Role:</strong> {result.cross_platform_strategy.facebook_role}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Google Role:</strong> {result.cross_platform_strategy.google_role}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Budget Allocation:</strong> {result.cross_platform_strategy.budget_allocation}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Facebook Campaign Details */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FacebookIcon sx={{ mr: 1, color: '#1877F2' }} />
            <Typography>Facebook Campaign Details</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Bidding Strategy */}
          <Typography variant="subtitle1" gutterBottom>Bidding Strategy</Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                <strong>{result.facebook_campaign.bidding_strategy.strategy}:</strong> {result.facebook_campaign.bidding_strategy.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Best for:</strong> {result.facebook_campaign.bidding_strategy.best_for}
              </Typography>
              <Typography variant="body2">
                <strong>Budget suggestion:</strong> {result.facebook_campaign.bidding_strategy.budget_suggestion}
              </Typography>
            </CardContent>
          </Card>

          {/* Targeting Suggestions */}
          <Typography variant="subtitle1" gutterBottom>Targeting Suggestions</Typography>
          {result.facebook_campaign.targeting_suggestions.map((targeting, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>{targeting.audience_type}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {targeting.suggestions.map((suggestion, i) => (
                  <Chip key={i} label={suggestion} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          ))}

          {/* Ad Creatives */}
          <Typography variant="subtitle1" gutterBottom>Ad Creatives</Typography>
          {result.facebook_campaign.ad_creatives.map((creative, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Chip label={creative.template_type} size="small" />
                  <Box>
                    <IconButton size="small" onClick={() => onPreview(creative)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onCopy(`${creative.headline}\n\n${creative.text}`)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {creative.headline}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {creative.text}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Chip label={`CTA: ${creative.cta}`} size="small" color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    Image: {creative.image_suggestion}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Placement & Schedule */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Placement Suggestions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {result.facebook_campaign.placement_suggestions.map((placement, i) => (
                  <Chip key={i} label={placement} size="small" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Schedule Recommendation</Typography>
              <Typography variant="body2">{result.facebook_campaign.schedule_recommendation}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Google Campaign Details */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GoogleIcon sx={{ mr: 1, color: '#EA4335' }} />
            <Typography>Google Campaign Details</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Bidding Strategy */}
          <Typography variant="subtitle1" gutterBottom>Bidding Strategy</Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                <strong>{result.google_campaign.bidding_strategy.strategy}:</strong> {result.google_campaign.bidding_strategy.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Best for:</strong> {result.google_campaign.bidding_strategy.best_for}
              </Typography>
              <Typography variant="body2">
                <strong>Budget suggestion:</strong> {result.google_campaign.bidding_strategy.budget_suggestion}
              </Typography>
            </CardContent>
          </Card>

          {/* Keyword Suggestions */}
          <Typography variant="subtitle1" gutterBottom>Keyword Suggestions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Head Keywords</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {result.google_campaign.keyword_suggestions.head_keywords.map((keyword, i) => (
                  <Chip key={i} label={keyword} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Long-tail Keywords</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {result.google_campaign.keyword_suggestions.long_tail_keywords.slice(0, 5).map((keyword, i) => (
                  <Chip key={i} label={keyword} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Negative Keywords</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {result.google_campaign.keyword_suggestions.negative_keywords.map((keyword, i) => (
                  <Chip key={i} label={keyword} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Ad Creatives */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Ad Creatives</Typography>
          {result.google_campaign.ad_creatives.map((creative, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Chip label={creative.template_type} size="small" />
                  <Box>
                    <IconButton size="small" onClick={() => onPreview(creative)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onCopy(`${creative.headline1}\n${creative.headline2}\n${creative.headline3}\n\n${creative.description}`)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {creative.headline1}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {creative.headline2}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {creative.headline3}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {creative.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Chip label={`CTA: ${creative.cta}`} size="small" color="primary" />
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Network & Device Targeting */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Network Suggestions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {result.google_campaign.network_suggestions.map((network, i) => (
                  <Chip key={i} label={network} size="small" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Device Targeting</Typography>
              <Typography variant="body2">{result.google_campaign.device_targeting}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Performance Metrics */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InsightsIcon sx={{ mr: 1 }} />
            <Typography>Performance Metrics</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Expected CPC</Typography>
              <Typography variant="body1">{result.performance_metrics.expected_cpc}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Expected CTR</Typography>
              <Typography variant="body1">{result.performance_metrics.expected_ctr}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Conversion Rate</Typography>
              <Typography variant="body1">{result.performance_metrics.expected_conversion_rate}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Cost per Conversion</Typography>
              <Typography variant="body1">${result.performance_metrics.estimated_weekly_results.cost_per_conversion}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Estimated Weekly Results</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{result.performance_metrics.estimated_weekly_results.clicks}</Typography>
                      <Typography variant="body2">Clicks</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{result.performance_metrics.estimated_weekly_results.conversions}</Typography>
                      <Typography variant="body2">Conversions</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">${result.performance_metrics.estimated_weekly_results.cost_per_conversion}</Typography>
                      <Typography variant="body2">Cost/Conv</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Optimization Tips */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TipsAndUpdatesIcon sx={{ mr: 1 }} />
            <Typography>Optimization Tips</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {result.optimization_tips.map((tip, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                {tip.phase}
              </Typography>
              <List dense>
                {tip.actions.map((action, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>•</ListItemIcon>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>
              {index < result.optimization_tips.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Creative Results Component
const CreativeResults = ({ result, onCopy, onPreview }) => {
  if (!result.success) {
    return (
      <Alert severity="error">
        Failed to generate creatives. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Generated Creatives
      </Typography>

      {result.creatives?.map((creative, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {creative.platform.toUpperCase()} - {creative.ad_type}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Headline:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {creative.headline}
                </Typography>
                <IconButton size="small" onClick={() => onCopy(creative.headline)}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Description:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {creative.description}
                </Typography>
                <IconButton size="small" onClick={() => onCopy(creative.description)}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Box>

            {creative.cta && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Call to Action:
                </Typography>
                <Chip label={creative.cta} variant="outlined" />
              </Box>
            )}

            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<EditIcon />}
              onClick={() => onPreview(creative)}
            >
              Preview Ad
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

// Creative Preview Dialog Component
const CreativePreviewDialog = ({ open, creative, onClose }) => {
  if (!creative) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Ad Preview
      </DialogTitle>
      <DialogContent>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {creative.headline || creative.ad_copy?.split('\n')[0]}
          </Typography>
          <Typography variant="body2" paragraph>
            {creative.description || creative.ad_copy?.split('\n').slice(1).join(' ')}
          </Typography>
          {creative.cta && (
            <Button variant="contained" size="small">
              {creative.cta}
            </Button>
          )}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdCampaignGenerator;