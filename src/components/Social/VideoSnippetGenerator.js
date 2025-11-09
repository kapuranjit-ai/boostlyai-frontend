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

function VideoSnippetGenerator() {
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState('');
  const { data, error, loading, callApi } = useApi();

  const generateSnippets = async () => {
    await callApi(
      () => videoAPI.generateVideoSnippets(topic, videoType),
      'Video snippets generated successfully!'
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Video Snippet Generator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={8}>
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
              onClick={generateSnippets}
              disabled={!topic || loading}
              startIcon={<AutoAwesome />}
              size="large"
            >
              {loading ? 'Generating...' : 'Generate Snippets'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={generateSnippets} />
      )}

      {loading && <Loading message="Generating video snippets..." />}

      {data && data.video_snippets && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Video Snippets ({data.count})
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
    </Box>
  );
}

export default VideoSnippetGenerator;