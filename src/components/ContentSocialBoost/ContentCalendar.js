// ContentCalendar.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid } from 'date-fns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import the API services
import { contentCalendarAPI, projectAPI } from '../../services/api';
import { projectContext } from '../../services/api';

// Safe date formatting utility
const safeFormatDate = (dateString, formatString = 'PPpp', fallback = 'No date available') => {
  if (!dateString) return fallback;
  
  const date = new Date(dateString);
  return isValid(date) ? format(date, formatString) : fallback;
};

const ContentCalendar = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [topics, setTopics] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [calendarHistory, setCalendarHistory] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [googleAuthDialog, setGoogleAuthDialog] = useState(false);
  const [trelloSyncDialog, setTrelloSyncDialog] = useState(false);
  const [trelloApiKey, setTrelloApiKey] = useState('');
  const [trelloToken, setTrelloToken] = useState('');
  const [trelloBoardId, setTrelloBoardId] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchCalendarHistory();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else if (response.data && Array.isArray(response.data.projects)) {
        setProjects(response.data.projects);
      } else if (response.data && Array.isArray(response.data.items)) {
        setProjects(response.data.items);
      } else if (response.data && Array.isArray(response.data.results)) {
        setProjects(response.data.results);
      } else if (response.data && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else {
        console.warn('Unexpected projects API response structure:', response.data);
        setProjects([]);
      }
    } catch (err) {
      setError('Failed to fetch projects');
      setProjects([]);
    }
  };

  const fetchCalendarHistory = async (projectId = null) => {
    try {
      let response;
      if (projectId) {
        response = await contentCalendarAPI.getCalendarHistory(projectId, 10);
      } else {
        response = await contentCalendarAPI.getAllCalendars(10);
      }
      
      if (Array.isArray(response.data)) {
        setCalendarHistory(response.data);
      } else if (response.data && Array.isArray(response.data.calendars)) {
        setCalendarHistory(response.data.calendars);
      } else if (response.data && Array.isArray(response.data.items)) {
        setCalendarHistory(response.data.items);
      } else if (response.data && Array.isArray(response.data.results)) {
        setCalendarHistory(response.data.results);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCalendarHistory(response.data.data);
      } else {
        console.warn('Unexpected calendar history API response structure:', response.data);
        setCalendarHistory([]);
      }
    } catch (err) {
      setError('Failed to fetch calendar history');
      setCalendarHistory([]);
    }
  };

  const handleGenerateCalendar = async () => {
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const topicsArray = topics.split(',').map(topic => topic.trim()).filter(topic => topic);
      
      const response = await contentCalendarAPI.generateContentCalendar(
        parseInt(selectedProject),
        topicsArray,
        startDate,
        endDate
      );

      if (response.status === 200) {
        setMessage('Content calendar generation started. Check history for updates.');
        fetchCalendarHistory(selectedProject);
      } else {
        setError(response.data?.detail || 'Failed to generate content calendar');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate content calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await contentCalendarAPI.getGoogleAuthUrl();
      
      if (response.status === 200 && response.data.auth_url) {
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to get Google authentication URL');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initiate Google authentication');
    }
  };

  const handleTrelloSync = async (calendarId) => {
    setLoading(true);
    try {
      const response = await contentCalendarAPI.syncWithTrello(
        calendarId,
        trelloApiKey,
        trelloToken,
        trelloBoardId
      );

      if (response.status === 200) {
        setMessage('Trello sync started successfully');
        setTrelloSyncDialog(false);
      } else {
        setError(response.data?.detail || 'Failed to sync with Trello');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to sync with Trello');
    } finally {
      setLoading(false);
    }
  };

  const viewCalendarDetails = async (calendarId) => {
    try {
      const response = await contentCalendarAPI.getCalendar(calendarId);
      
      if (response.status === 200) {
        setSelectedCalendar(response.data);
      } else {
        setError('Failed to fetch calendar details');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch calendar details');
    }
  };

  // Filter out empty content items
  const filterEmptyContent = (items) => {
    return items.filter(item => 
      item.title && item.title !== 'Blog Post' && !item.title.startsWith('Blog Post ') ||
      item.content && item.content !== 'Social media content' && !item.content.startsWith('Social media content ')
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Content Calendar Generator
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generate New Content Calendar
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    label="Select Project"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    margin="normal"
                    disabled={!Array.isArray(projects) || projects.length === 0}
                  >
                    {Array.isArray(projects) && projects.length > 0 ? (
                      projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {projects.length === 0 ? 'No projects available' : 'Loading projects...'}
                      </MenuItem>
                    )}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Topics (comma-separated)"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                    placeholder="Enter topics separated by commas"
                  />

                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />

                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateCalendar}
                      disabled={loading || !selectedProject}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Generate Calendar'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setGoogleAuthDialog(true)}
                    >
                      Connect Google Calendar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Calendars
                  </Typography>

                  <List>
                    {Array.isArray(calendarHistory) && calendarHistory.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No calendars found" />
                      </ListItem>
                    ) : (
                      Array.isArray(calendarHistory) && calendarHistory.map((calendar) => (
                        <ListItem key={calendar.id} divider>
                          <ListItemText
                            primary={`Calendar #${calendar.id}`}
                            secondary={
                              <>
                                <Typography variant="body2">
                                  Created: {safeFormatDate(calendar.generated_at)}
                                </Typography>
                                <Typography variant="body2">
                                  Status: {calendar.status || 'Unknown'}
                                </Typography>
                                <Typography variant="body2">
                                  Blog Posts: {calendar.blog_post_count || 0}
                                </Typography>
                                <Typography variant="body2">
                                  Social Posts: {calendar.social_post_count || 0}
                                </Typography>
                              </>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', sm: 'row' }}>
                            <Button
                              size="small"
                              onClick={() => viewCalendarDetails(calendar.id)}
                              variant="outlined"
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setTrelloSyncDialog(true);
                                setSelectedCalendar(calendar);
                              }}
                              variant="outlined"
                            >
                              Sync Trello
                            </Button>
                          </Box>
                        </ListItem>
                      ))
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Google Auth Dialog */}
        <Dialog open={googleAuthDialog} onClose={() => setGoogleAuthDialog(false)}>
          <DialogTitle>Connect Google Calendar</DialogTitle>
          <DialogContent>
            <Typography>
              Click the button below to authenticate with Google Calendar. This will allow
              you to sync your content calendar with Google Calendar.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGoogleAuthDialog(false)}>Cancel</Button>
            <Button onClick={handleGoogleAuth} variant="contained">
              Authenticate with Google
            </Button>
          </DialogActions>
        </Dialog>

        {/* Trello Sync Dialog */}
        <Dialog open={trelloSyncDialog} onClose={() => setTrelloSyncDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Sync with Trello</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Trello API Key"
              value={trelloApiKey}
              onChange={(e) => setTrelloApiKey(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Trello Token"
              value={trelloToken}
              onChange={(e) => setTrelloToken(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Board ID (Optional)"
              value={trelloBoardId}
              onChange={(e) => setTrelloBoardId(e.target.value)}
              margin="normal"
              helperText="Leave empty to create a new board"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTrelloSyncDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleTrelloSync(selectedCalendar.id)}
              variant="contained"
              disabled={loading || !trelloApiKey || !trelloToken}
            >
              {loading ? <CircularProgress size={24} /> : 'Sync with Trello'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Calendar Details Dialog */}
        {selectedCalendar && (
          <Dialog
            open={!!selectedCalendar}
            onClose={() => setSelectedCalendar(null)}
            maxWidth="md"
            fullWidth
            scroll="paper"
          >
            <DialogTitle>
              Calendar Details #{selectedCalendar.id}
              <Typography variant="body2" color="text.secondary">
                Generated: {safeFormatDate(selectedCalendar.generated_at)}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Overview</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Status:</strong> {selectedCalendar.status}</Typography>
                    <Typography variant="body2"><strong>Start Date:</strong> {safeFormatDate(selectedCalendar.start_date, 'PP')}</Typography>
                    <Typography variant="body2"><strong>End Date:</strong> {safeFormatDate(selectedCalendar.end_date, 'PP')}</Typography>
                    <Typography variant="body2"><strong>Total Weeks:</strong> {selectedCalendar.total_weeks}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Blog Posts:</strong> {selectedCalendar.blog_post_count}</Typography>
                    <Typography variant="body2"><strong>Social Posts:</strong> {selectedCalendar.social_post_count}</Typography>
                    <Typography variant="body2"><strong>Google Sync:</strong> {selectedCalendar.google_sync_status}</Typography>
                    <Typography variant="body2"><strong>Trello Sync:</strong> {selectedCalendar.trello_sync_status}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Content Themes</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedCalendar.content_themes && selectedCalendar.content_themes.map((theme, index) => (
                    <Chip key={index} label={theme} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>SEO Focus</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedCalendar.seo_focus && selectedCalendar.seo_focus.map((focus, index) => (
                    <Chip key={index} label={focus} size="small" color="primary" />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Blog Posts
              </Typography>
              
              {selectedCalendar.blog_posts && filterEmptyContent(selectedCalendar.blog_posts).length > 0 ? (
                filterEmptyContent(selectedCalendar.blog_posts).map((post, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{post.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Publish Date:</strong> {safeFormatDate(post.publish_date, 'PP', 'Not scheduled')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Theme:</strong> {post.theme || 'No theme specified'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Estimated Word Count:</strong> {post.estimated_word_count || 'Not specified'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Week:</strong> {post.week_number || 'Not specified'}
                      </Typography>
                      
                      {post.keywords && post.keywords.length > 0 && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Keywords:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {post.keywords.map((keyword, i) => (
                              <Chip key={i} label={keyword} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </>
                      )}
                      
                      {post.talking_points && post.talking_points.length > 0 && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Talking Points:</strong>
                          </Typography>
                          <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                            {post.talking_points.map((point, i) => (
                              <li key={i}><Typography variant="body2">{point}</Typography></li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {post.target_platforms && post.target_platforms.length > 0 && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Target Platforms:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {post.target_platforms.map((platform, i) => (
                              <Chip key={i} label={platform} size="small" color="secondary" />
                            ))}
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No blog posts available for this calendar.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Social Media Posts
              </Typography>
              
              {selectedCalendar.social_posts && filterEmptyContent(selectedCalendar.social_posts).length > 0 ? (
                filterEmptyContent(selectedCalendar.social_posts).map((post, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">
                        {post.platform && post.platform !== 'general' ? `${post.platform}: ` : ''}
                        {post.content.substring(0, 50)}{post.content.length > 50 ? '...' : ''}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Publish Date:</strong> {safeFormatDate(post.publish_date, 'PP', 'Not scheduled')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Platform:</strong> {post.platform || 'General'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Theme:</strong> {post.theme || 'No theme specified'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Week:</strong> {post.week_number || 'Not specified'}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {post.content}
                      </Typography>
                      
                      {post.hashtags && post.hashtags.length > 0 && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Hashtags:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {post.hashtags.map((hashtag, i) => (
                              <Chip key={i} label={hashtag} size="small" color="primary" />
                            ))}
                          </Box>
                        </>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Media Type:</strong> {post.media_type || 'Not specified'}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No social media posts available for this calendar.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCalendar(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default ContentCalendar;