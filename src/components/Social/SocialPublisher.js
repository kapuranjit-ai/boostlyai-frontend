// src/components/Social/SocialPublisher.js
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
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { 
  Send, 
  Schedule, 
  AddPhotoAlternate,
  Analytics,
  ContentCopy
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { socialAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function SocialPublisher() {
  const [platform, setPlatform] = useState('facebook');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const { data, error, loading, callApi } = useApi();

  const publishPost = async () => {
    await callApi(
      () => socialAPI.createSocialPost(platform, 1, content, mediaUrl),
      'Post published successfully!'
    );
  };

  const platforms = [
    { value: 'facebook', label: 'Facebook', color: '#1877f2' },
    { value: 'twitter', label: 'Twitter', color: '#1da1f2' },
    { value: 'linkedin', label: 'LinkedIn', color: '#0a66c2' },
    { value: 'instagram', label: 'Instagram', color: '#e4405f' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Social Media Publisher
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and schedule social media posts across multiple platforms
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New Post
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value)}
              >
                {platforms.map((platform) => (
                  <MenuItem key={platform.value} value={platform.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: platform.color,
                          mr: 1.5
                        }}
                      />
                      {platform.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Post Content"
              placeholder="What would you like to share?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Media URL (optional)"
              placeholder="https://example.com/image.jpg"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={schedulePost}
                  onChange={(e) => setSchedulePost(e.target.checked)}
                  color="primary"
                />
              }
              label="Schedule for later"
            />

            {schedulePost && (
              <TextField
                fullWidth
                label="Scheduled Time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
              />
            )}

            <Button
              variant="contained"
              onClick={publishPost}
              disabled={loading || !content}
              startIcon={schedulePost ? <Schedule /> : <Send />}
              size="large"
              sx={{ mt: 2 }}
            >
              {loading ? 'Publishing...' : schedulePost ? 'Schedule Post' : 'Publish Now'}
            </Button>
          </Paper>

          {data && (
            <Card sx={{ mt: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Post Published Successfully!
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your post has been {schedulePost ? 'scheduled' : 'published'} on {platforms.find(p => p.value === platform)?.label}.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={() => navigator.clipboard.writeText(content)}
                >
                  Copy Content
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Platform Tips
            </Typography>
            
            {platforms.map((platformItem) => (
              <Box
                key={platformItem.value}
                sx={{
                  p: 2,
                  mb: 2,
                  border: platform === platformItem.value ? `2px solid ${platformItem.color}` : '1px solid #e2e8f0',
                  borderRadius: 2,
                  bgcolor: platform === platformItem.value ? `${platformItem.color}08` : 'transparent'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: platformItem.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {platformItem.label}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {platformItem.value === 'facebook' && 'Ideal length: 40-80 characters. Use engaging questions.'}
                  {platformItem.value === 'twitter' && 'Max 280 characters. Use hashtags and mentions strategically.'}
                  {platformItem.value === 'linkedin' && 'Professional tone. 150-300 characters. Focus on value.'}
                  {platformItem.value === 'instagram' && 'Visual-focused. Use emojis and 5-10 hashtags.'}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              💡 Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li><Typography variant="caption">Post during peak engagement hours</Typography></li>
              <li><Typography variant="caption">Include relevant hashtags</Typography></li>
              <li><Typography variant="caption">Use high-quality images</Typography></li>
              <li><Typography variant="caption">Engage with comments promptly</Typography></li>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <ErrorMessage error={error} onRetry={publishPost} />
      )}

      {loading && <Loading message="Publishing post..." />}
    </Box>
  );
}

export default SocialPublisher;