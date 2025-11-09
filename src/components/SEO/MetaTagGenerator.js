// src/components/SEO/MetaTagGenerator.js
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
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { AutoAwesome, ContentCopy, Download } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { seoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function MetaTagGenerator() {
  const [contentType, setContentType] = useState('article');
  const [url, setUrl] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { data, callApi } = useApi();
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMetaTags = async () => {
    await callApi(
      () => seoAPI.generateMetaTags(url,focusKeywords.split(',').map(k => k.trim()), contentType),
      'Meta tags generated successfully!'
    );
  };

  const aiGenerateMetaTags = async () => {
    // For AI generation, you might need to adjust the API call based on your backend
    // Assuming your AI endpoint also accepts content_type
    await callApi(
      () => seoAPI.generateMetaTagsWithAI(url, focusKeywords.split(',').map(k => k.trim()), contentType),
      'AI meta tags generated successfully!'
    );
  };

  const handleGenerate = () => {
    if (activeTab === 0) {
      generateMetaTags();
    } else {
      aiGenerateMetaTags();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadMetaTags = () => {
    if (!data) return;
    
    const content = `
<title>${data.meta_title}</title>
<meta name="description" content="${data.meta_description}">
<meta name="keywords" content="${data.meta_keywords.join(', ')}">
    `.trim();

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Meta Tag Generator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Create optimized meta tags for better search engine visibility and click-through rates
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Basic Generator" />
          <Tab label="AI-Powered Generator" />
        </Tabs>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={15} md={6}>
            <TextField
              fullWidth
              label="Focus Keywords (comma-separated)"
              placeholder="digital marketing, seo, social media"
              value={focusKeywords}
              onChange={(e) => setFocusKeywords(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentType}
                label="Content Type"
                onChange={(e) => setContentType(e.target.value)}
              >
                <MenuItem value="article">Article/Blog Post</MenuItem>
                <MenuItem value="product">Product Page</MenuItem>
                <MenuItem value="service">Service Page</MenuItem>
                <MenuItem value="landing">Landing Page</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {activeTab === 1 && (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Focus Keywords (comma-separated)"
              placeholder="digital marketing, seo, social media"
              value={focusKeywords}
              onChange={(e) => setFocusKeywords(e.target.value)}
              variant="outlined"
            />
          </Grid>
        )}

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading || !url}
          startIcon={<AutoAwesome />}
          size="large"
          sx={{ mt: 2 }}
        >
          {loading ? 'Generating...' : 'Generate Meta Tags'}
        </Button>

        {activeTab === 1 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            AI analysis will generate meta tags based on your website content and focus keywords
          </Alert>
        )}
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleGenerate} />
      )}

      {loading && <Loading message="Generating meta tags..." />}

      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Generated Meta Tags
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Title Tag
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', position: 'relative' }}>
                    <Typography variant="body2" fontFamily="monospace">
                      {data.meta_title}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(data.meta_title)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      Copy
                    </Button>
                  </Paper>
                  <Typography variant="caption" color="text.secondary">
                    Length: {data.meta_title.length} characters (Recommended: 50-60)
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Meta Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', position: 'relative' }}>
                    <Typography variant="body2" fontFamily="monospace">
                      {data.meta_description}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(data.meta_description)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      Copy
                    </Button>
                  </Paper>
                  <Typography variant="caption" color="text.secondary">
                    Length: {data.meta_description.length} characters (Recommended: 150-160)
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Meta Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {data.meta_keywords?.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadMetaTags}
                  sx={{ mt: 2 }}
                >
                  Download HTML
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Recommendations
                </Typography>
                
                {data.recommendations?.map((recommendation, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          mt: 0.5,
                          mr: 1.5
                        }}
                      />
                      <Typography variant="body2">
                        {recommendation}
                      </Typography>
                    </Box>
                    {index < data.recommendations.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}

                {data.using_fallback && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Using fallback mode - add OpenAI API key for AI-powered recommendations
                  </Alert>
                )}

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Include your primary keyword in the title tag and keep it under 60 characters 
                    for optimal search engine visibility.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default MetaTagGenerator;