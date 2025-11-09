// src/pages/SocialMediaManager.js
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  PostAdd as PostAddIcon,
  TrendingUp as TrendingUpIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { seoAPI } from '../../services/api';

const SocialMediaManager = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [postingSchedule, setPostingSchedule] = useState(null);
  const [biddingStrategies, setBiddingStrategies] = useState(null);
  const [adTemplates, setAdTemplates] = useState(null);

  // Form states
  const [postForm, setPostForm] = useState({
    content: '',
    platform: 'facebook'
  });

  const [scheduleForm, setScheduleForm] = useState({
    content_calendar: [{ content: '', scheduled_time: '' }],
    platform: 'facebook',
    schedule_time: new Date().toISOString()
  });

  const [analysisForm, setAnalysisForm] = useState({
    feed: [{ content: 'Sample post 1' }, { content: 'Sample post 2' }]
  });

  useEffect(() => {
    loadInitialData();
  }, []);

const loadInitialData = async () => {
  try {
    const [scheduleRes, biddingRes, templatesRes] = await Promise.all([
      seoAPI.getPostingSchedule(),
      seoAPI.getBiddingStrategies('facebook'),
      seoAPI.getAdTemplates('facebook')
    ]);
    
    // Check if the response has the expected structure
    if (scheduleRes.data && scheduleRes.data.schedule) {
      setPostingSchedule(scheduleRes.data.schedule);
    } else {
      // Handle the case where the response is the schedule data itself
      setPostingSchedule(scheduleRes.data);
    }
    
    // setBiddingStrategies(biddingRes.data);
    // setAdTemplates(templatesRes.data);
  } catch (err) {
    //console.error('Error loading initial data:', err);
    setError('Failed to load social media data. Please try again.');
  }
};
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePostFormChange = (field) => (event) => {
    setPostForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleScheduleFormChange = (field) => (event) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleContentCalendarChange = (index, field, value) => {
    const newCalendar = [...scheduleForm.content_calendar];
    newCalendar[index] = { ...newCalendar[index], [field]: value };
    setScheduleForm(prev => ({
      ...prev,
      content_calendar: newCalendar
    }));
  };

  const addContentCalendarItem = () => {
    setScheduleForm(prev => ({
      ...prev,
      content_calendar: [...prev.content_calendar, { content: '', scheduled_time: '' }]
    }));
  };

  const removeContentCalendarItem = (index) => {
    if (scheduleForm.content_calendar.length > 1) {
      const newCalendar = scheduleForm.content_calendar.filter((_, i) => i !== index);
      setScheduleForm(prev => ({
        ...prev,
        content_calendar: newCalendar
      }));
    }
  };

  const postToSocialMedia = async () => {
    if (!postForm.content.trim()) {
      setError('Please enter content to post');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.postToSocial({
        content: postForm.content,
        platform: postForm.platform
      });

      setPostResult(response.data);
      setSuccess('Posted to social media successfully!');
    } catch (err) {
      //console.error('Error posting to social media:', err);
      setError(err.response?.data?.detail || 'Failed to post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const schedulePosts = async () => {
    const validPosts = scheduleForm.content_calendar.filter(post => 
      post.content.trim() && post.scheduled_time
    );
    
    if (validPosts.length === 0) {
      setError('Please add at least one post with content and scheduled time');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.schedulePosts({
        content_calendar: validPosts,
        platform: scheduleForm.platform,
        schedule_time: scheduleForm.schedule_time
      });

      setScheduleResult(response.data);
      setSuccess('Posts scheduled successfully!');
    } catch (err) {
      //console.error('Error scheduling posts:', err);
      setError(err.response?.data?.detail || 'Failed to schedule posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeFeed = async () => {
    if (analysisForm.feed.length === 0) {
      setError('Please add content to analyze');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await seoAPI.analyzeFeed(analysisForm.feed);
      setAnalysisResult(response.data);
      setSuccess('Feed analyzed successfully!');
    } catch (err) {
      //console.error('Error analyzing feed:', err);
      setError(err.response?.data?.detail || 'Failed to analyze feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FacebookIcon />;
      case 'instagram': return <InstagramIcon />;
      case 'twitter': return <TwitterIcon />;
      case 'linkedin': return <LinkedInIcon />;
      default: return <PostAddIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Social Media Manager
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Post Now" />
        <Tab label="Schedule Posts" />
        <Tab label="Analyze Feed" />
        <Tab label="Posting Schedule" />
        <Tab label="Bidding Strategies" />
        <Tab label="Ad Templates" />
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
        <PostNowTab
          form={postForm}
          loading={loading}
          result={postResult}
          onChange={handlePostFormChange}
          onSubmit={postToSocialMedia}
        />
      )}

      {activeTab === 1 && (
        <SchedulePostsTab
          form={scheduleForm}
          loading={loading}
          result={scheduleResult}
          onChange={handleScheduleFormChange}
          onContentChange={handleContentCalendarChange}
          onAddItem={addContentCalendarItem}
          onRemoveItem={removeContentCalendarItem}
          onSubmit={schedulePosts}
        />
      )}

      {activeTab === 2 && (
        <AnalyzeFeedTab
          form={analysisForm}
          loading={loading}
          result={analysisResult}
          onSubmit={analyzeFeed}
        />
      )}

      {activeTab === 3 && (
        <PostingScheduleTab data={postingSchedule} />
      )}

      {activeTab === 4 && (
        <BiddingStrategiesTab data={biddingStrategies} />
      )}

      {activeTab === 5 && (
        <AdTemplatesTab data={adTemplates} />
      )}
    </Box>
  );
};

// Post Now Tab Component
const PostNowTab = ({ form, loading, result, onChange, onSubmit }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Create Social Media Post
          </Typography>

          <TextField
            select
            fullWidth
            label="Platform"
            value={form.platform}
            onChange={onChange('platform')}
            sx={{ mb: 2 }}
          >
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={form.content}
            onChange={onChange('content')}
            placeholder="Write your social media post here..."
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          >
            Post Now
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <PostResult result={result} />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <PostAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Create a post to share on social media
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Schedule Posts Tab Component
const SchedulePostsTab = ({ form, loading, result, onChange, onContentChange, onAddItem, onRemoveItem, onSubmit }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Schedule Multiple Posts
          </Typography>

          <TextField
            select
            fullWidth
            label="Platform"
            value={form.platform}
            onChange={onChange('platform')}
            sx={{ mb: 2 }}
          >
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
          </TextField>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Content Calendar
          </Typography>

          {form.content_calendar.map((post, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Post {index + 1}</Typography>
                {form.content_calendar.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onRemoveItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Content"
                value={post.content}
                onChange={(e) => onContentChange(index, 'content', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled Time"
                value={post.scheduled_time}
                onChange={(e) => onContentChange(index, 'scheduled_time', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          ))}

          <Button variant="outlined" onClick={onAddItem} sx={{ mb: 2 }}>
            Add Another Post
          </Button>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <ScheduleIcon />}
            >
              Schedule Posts
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <ScheduleResult result={result} />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Schedule multiple posts for future publishing
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Analyze Feed Tab Component
const AnalyzeFeedTab = ({ form, loading, result, onSubmit }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analyze Content Feed
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This feature analyzes your content feed and provides recommendations for improvement.
          </Typography>

          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
          >
            Analyze Feed
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {result ? (
          <AnalysisResult result={result} />
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Analyze your content feed for optimization recommendations
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

// Posting Schedule Tab Component
// Posting Schedule Tab Component - UPDATED FOR NEW JSON FORMAT
const PostingScheduleTab = ({ data }) => {
  if (!data) {
    return (
      <Alert severity="info">
        Loading posting schedule data...
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Optimal Posting Schedule
      </Typography>

      {/* Best Times Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
        Best Posting Times
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {data.best_times && Object.entries(data.best_times).map(([platform, time]) => (
          <Grid item xs={12} md={6} lg={4} key={platform}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {platform === 'facebook' && <FacebookIcon sx={{ mr: 1, color: '#1877F2' }} />}
                  {platform === 'instagram' && <InstagramIcon sx={{ mr: 1, color: '#E4405F' }} />}
                  {platform === 'twitter' && <TwitterIcon sx={{ mr: 1, color: '#1DA1F2' }} />}
                  {platform === 'linkedin' && <LinkedInIcon sx={{ mr: 1, color: '#0A66C2' }} />}
                  {platform === 'youtube' && (
                    <Box sx={{ width: 24, height: 24, mr: 1, color: '#FF0000' }}>
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </Box>
                  )}
                  <Typography variant="subtitle2">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {time}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Frequency Section */}
      <Typography variant="subtitle1" gutterBottom>
        Recommended Posting Frequency
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {data.frequency && Object.entries(data.frequency).map(([platform, freq]) => (
          <Grid item xs={12} md={6} lg={4} key={platform}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {platform === 'facebook' && <FacebookIcon sx={{ mr: 1, color: '#1877F2' }} />}
                  {platform === 'instagram' && <InstagramIcon sx={{ mr: 1, color: '#E4405F' }} />}
                  {platform === 'twitter' && <TwitterIcon sx={{ mr: 1, color: '#1DA1F2' }} />}
                  {platform === 'linkedin' && <LinkedInIcon sx={{ mr: 1, color: '#0A66C2' }} />}
                  {platform === 'youtube' && (
                    <Box sx={{ width: 24, height: 24, mr: 1, color: '#FF0000' }}>
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </Box>
                  )}
                  <Typography variant="subtitle2">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {freq}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Optimal Content Mix Section */}
      <Typography variant="subtitle1" gutterBottom>
        Optimal Content Mix
      </Typography>
      <Grid container spacing={2}>
        {data.optimal_mix && Object.entries(data.optimal_mix).map(([contentType, percentage]) => (
          <Grid item xs={12} md={6} lg={4} key={contentType}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {contentType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseInt(percentage)} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {percentage}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Bidding Strategies Tab Component
const BiddingStrategiesTab = ({ data }) => {
  if (!data) {
    return (
      <Alert severity="info">
        Loading bidding strategies...
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bidding Strategies for {data.platform}
      </Typography>

      <Grid container spacing={2}>
        {data.strategies.map((strategy, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {strategy.strategy}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {strategy.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Best for:</strong> {strategy.best_for}
                </Typography>
                <Typography variant="body2">
                  <strong>Budget:</strong> {strategy.budget_suggestion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Ad Templates Tab Component
const AdTemplatesTab = ({ data }) => {
  if (!data) {
    return (
      <Alert severity="info">
        Loading ad templates...
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ad Templates for {data.platform}
      </Typography>

      <Grid container spacing={2}>
        {data.templates.map((template, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {template.template_type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Headline:</strong> {template.headline}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {template.description}
                </Typography>
                {template.cta && (
                  <Typography variant="body2">
                    <strong>CTA:</strong> {template.cta}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Result Components
const PostResult = ({ result }) => {
  if (!result.success) {
    return (
      <Alert severity="error">
        Failed to post. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Post Successful!
      </Typography>
      <Alert severity="success" sx={{ mb: 2 }}>
        Your content has been posted successfully.
      </Alert>
      <Typography variant="body2">
        Post ID: {result.post_id}
      </Typography>
      <Typography variant="body2">
        Platform: {result.platform}
      </Typography>
      <Typography variant="body2">
        Status: {result.status}
      </Typography>
    </Paper>
  );
};

const ScheduleResult = ({ result }) => {
  if (!result.success) {
    return (
      <Alert severity="error">
        Failed to schedule posts. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Posts Scheduled!
      </Typography>
      <Alert severity="success" sx={{ mb: 2 }}>
        {result.scheduled_posts} posts have been scheduled.
      </Alert>
      <Typography variant="body2">
        Platform: {result.platform}
      </Typography>
      <Typography variant="body2">
        Schedule Time: {new Date(result.schedule_time).toLocaleString()}
      </Typography>
      <Typography variant="body2">
        Message: {result.message}
      </Typography>
    </Paper>
  );
};

const AnalysisResult = ({ result }) => {
  if (!result.success) {
    return (
      <Alert severity="error">
        Failed to analyze feed. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Feed Analysis Results
      </Typography>

      <Typography variant="body2" gutterBottom>
        Total Posts Analyzed: {result.total_posts}
      </Typography>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Analysis Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre>{JSON.stringify(result.analysis, null, 2)}</pre>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Recommendations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {result.recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={rec} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default SocialMediaManager;