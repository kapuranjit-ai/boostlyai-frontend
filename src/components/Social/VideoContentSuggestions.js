import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { videoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function VideoContentSuggestions() {
  const [topic, setTopic] = useState('');
  const [maxResults, setMaxResults] = useState(5);
  const [activeTab, setActiveTab] = useState(0);
  const { data, error, loading, callApi } = useApi();

  const getContentSuggestions = async () => {
    try {
      const response = await callApi(
        () => videoAPI.getContentSuggestions(topic, maxResults),
        'Content suggestions fetched successfully!'
      );
      console.log('API Response:', response);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Check if we have any content to display
  const hasContent = data && data.content && (
    data.content.reddit?.length > 0 ||
    data.content.images?.length > 0 ||
    data.content.video_ideas?.length > 0
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Suggestions
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Topic"
              placeholder="Enter topic for content suggestions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Max Results</InputLabel>
              <Select
                value={maxResults}
                label="Max Results"
                onChange={(e) => setMaxResults(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={getContentSuggestions}
              disabled={!topic || loading}
              startIcon={<Search />}
              size="large"
              fullWidth
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={getContentSuggestions} />
      )}

      {loading && <Loading message="Fetching content suggestions..." />}

      {data && data.content && !loading && (
        <Box>
          {hasContent ? (
            <>
              <Typography variant="h5" gutterBottom>
                Content Suggestions for "{data.topic || topic}"
              </Typography>
              
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Reddit Posts" />
                <Tab label="Video Ideas" />
                <Tab label="Images" />
              </Tabs>

              {/* Reddit Posts Tab */}
              {activeTab === 0 && data.content.reddit && data.content.reddit.length > 0 && (
                <Grid container spacing={3}>
                  {data.content.reddit.map((post, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label={`r/${post.subreddit}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`↑ ${post.score}`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {post.title}
                          </Typography>
                          <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
                            {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="textSecondary">
                              {post.comments} comments
                            </Typography>
                            <Button 
                              size="small" 
                              href={post.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View Post
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Video Ideas Tab */}
              {activeTab === 1 && data.content.video_ideas && data.content.video_ideas.length > 0 && (
                <Grid container spacing={3}>
                  {data.content.video_ideas.map((idea, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Chip 
                            label={idea.video_type} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            {idea.title}
                          </Typography>
                          <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
                            {idea.description}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" paragraph>
                            Duration: {idea.duration}
                          </Typography>
                          <Typography variant="subtitle2" gutterBottom>
                            Key Points:
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {idea.key_points.map((point, idx) => (
                              <Chip
                                key={idx}
                                label={point}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Images Tab */}
              {activeTab === 2 && data.content.images && data.content.images.length > 0 && (
                <Grid container spacing={3}>
                  {data.content.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <Box
                          component="img"
                          src={image.url}
                          alt={image.description}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover'
                          }}
                        />
                        <CardContent>
                          <Typography variant="body2" paragraph>
                            {image.description}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Source: {image.source}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No content suggestions found for this topic.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default VideoContentSuggestions;