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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { videoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function CompleteVideoContent() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [videoType, setVideoType] = useState('');
  const { data, error, loading, callApi } = useApi();

  const generateCompleteContent = async () => {
    await callApi(
      () => videoAPI.generateCompleteContent(topic, platform, videoType),
      'Complete video content generated successfully!'
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Complete Video Content Generator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Topic"
              placeholder="Enter your video topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value)}
              >
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Video Type (Optional)</InputLabel>
              <Select
                value={videoType}
                label="Video Type (Optional)"
                onChange={(e) => setVideoType(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="tutorial">Tutorial</MenuItem>
                <MenuItem value="tips">Tips</MenuItem>
                <MenuItem value="behind_scenes">Behind the Scenes</MenuItem>
                <MenuItem value="testimonial">Testimonial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={generateCompleteContent}
              disabled={!topic || loading}
              startIcon={<AutoAwesome />}
              size="large"
            >
              {loading ? 'Generating...' : 'Generate Complete Content'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={generateCompleteContent} />
      )}

      {loading && <Loading message="Generating complete video content..." />}

      {data && (
        <Box>
          {/* Video Snippets */}
          {data.video_snippets && data.video_snippets.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                Video Snippets ({data.video_snippets.length})
              </Typography>
              <Grid container spacing={3}>
                {data.video_snippets.map((snippet, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {snippet.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          Duration: {snippet.duration || 'N/A'}
                        </Typography>
                        {snippet.key_points && snippet.key_points.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2">Key Points:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {snippet.key_points.map((point, pointIndex) => (
                                <Chip key={pointIndex} label={point} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Ad Copies */}
          {data.ad_copies && data.ad_copies.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                Ad Copies ({data.ad_copies.length})
              </Typography>
              <Grid container spacing={3}>
                {data.ad_copies.map((copy, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {copy.headline}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {copy.description}
                        </Typography>
                        {copy.cta && (
                          <Chip label={copy.cta} color="primary" variant="outlined" />
                        )}
                        {copy.hashtags && copy.hashtags.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2">Hashtags:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {copy.hashtags.map((tag, tagIndex) => (
                                <Chip key={tagIndex} label={tag} size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Content Suggestions */}
          {data.content_suggestions && data.content_suggestions.length > 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Content Suggestions ({data.content_suggestions.length})
              </Typography>
              <Grid container spacing={3}>
                {data.content_suggestions.map((suggestion, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {suggestion.title}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {suggestion.content}
                        </Typography>
                        {suggestion.source && (
                          <Typography variant="caption" color="textSecondary">
                            Source: {suggestion.source}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default CompleteVideoContent;