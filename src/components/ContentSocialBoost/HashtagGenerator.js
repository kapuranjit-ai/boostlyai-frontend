// src/components/HashtagGenerator/HashtagGenerator.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ContentCopy,
  TrendingUp,
  Analytics,
  Public,
  ExpandMore,
  CheckCircle,
  Info,
  Warning
} from '@mui/icons-material';
import { useHashtagGenerator } from '../ContentSocialBoost/useHashtagGenerator';
// import APIConnectionTest from '../Debug/APIConnectionTest';

const HashtagGenerator = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [maxHashtags, setMaxHashtags] = useState(30);
  const [hashtagToAnalyze, setHashtagToAnalyze] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [copiedHashtags, setCopiedHashtags] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  const {
    loading,
    error,
    hashtags,
    analysis,
    platforms,
    generateHashtags,
    analyzeHashtag,
    getPlatformRecommendations,
    resetError
  } = useHashtagGenerator();

  useEffect(() => {
    // Only load platform recommendations if the tab is active
    if (activeTab === 2) {
      getPlatformRecommendations().catch(err => {
        console.error('Failed to load platform recommendations:', err);
      });
    }
  }, [activeTab, getPlatformRecommendations]);

  const handleGenerate = async () => {
    if (!content.trim()) {
      resetError();
      return;
    }
    try {
      await generateHashtags(content, platform, topic, maxHashtags);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!hashtagToAnalyze.trim()) return;
    try {
      await analyzeHashtag(hashtagToAnalyze);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHashtags(text);
    setTimeout(() => setCopiedHashtags(''), 2000);
  };

  const formatHashtags = (hashtagsArray) => {
    if (!hashtagsArray) return '';
    return hashtagsArray.map(tag => `#${tag.replace(/#/g, '').trim()}`).join(' ');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Hashtag Generator
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => setShowDebug(true)}
          startIcon={<Warning />}
        >
          Debug
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={resetError}>
          {error.includes('404') || error.includes('Not Found') ? (
            <>
              API endpoint not found. Please check:
              <ul>
                <li>Backend server is running</li>
                <li>API routes are correctly configured</li>
                <li>CORS is enabled on the backend</li>
              </ul>
            </>
          ) : (
            error
          )}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<TrendingUp />} label="Generate Hashtags" />
          <Tab icon={<Analytics />} label="Analyze Hashtag" />
          <Tab icon={<Public />} label="Platform Guide" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Generate Hashtags
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your social media content here..."
                margin="normal"
              />

              <TextField
                fullWidth
                select
                label="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </TextField>

              <TextField
                fullWidth
                label="Topic (Optional)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., technology, fashion, food..."
                margin="normal"
              />

              <TextField
                fullWidth
                type="number"
                label="Max Hashtags"
                value={maxHashtags}
                onChange={(e) => setMaxHashtags(parseInt(e.target.value) || 30)}
                inputProps={{ min: 1, max: 50 }}
                margin="normal"
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={loading || !content.trim()}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Hashtags'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 300 }}>
              <Typography variant="h5" gutterBottom>
                Generated Hashtags
              </Typography>

              {hashtags?.hashtags ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {hashtags.hashtags.length} hashtags generated
                    </Typography>
                    <Tooltip title="Copy all hashtags">
                      <IconButton
                        onClick={() => copyToClipboard(formatHashtags(hashtags.hashtags))}
                        color={copiedHashtags === formatHashtags(hashtags.hashtags) ? 'success' : 'default'}
                      >
                        {copiedHashtags === formatHashtags(hashtags.hashtags) ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {hashtags.hashtags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        variant="outlined"
                        onClick={() => setHashtagToAnalyze(tag)}
                      />
                    ))}
                  </Box>

                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" fontFamily="monospace">
                      {formatHashtags(hashtags.hashtags)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Enter your content and click "Generate Hashtags" to get started
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Analyze Hashtag
              </Typography>

              <TextField
                fullWidth
                label="Hashtag to Analyze"
                value={hashtagToAnalyze}
                onChange={(e) => setHashtagToAnalyze(e.target.value.replace(/#/g, ''))}
                placeholder="Enter a hashtag (without #)"
                margin="normal"
              />

              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={loading || !hashtagToAnalyze.trim()}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Hashtag'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: 200 }}>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>

              {analysis?.analysis ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    #{hashtagToAnalyze}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Popularity
                      </Typography>
                      <Typography variant="h6">
                        {analysis.analysis.popularity || 'Medium'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Relevance
                      </Typography>
                      <Typography variant="h6">
                        {analysis.analysis.relevance_score !== undefined 
                          ? `${analysis.analysis.relevance_score}/10` 
                          : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {analysis.analysis.recommended_platforms && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Recommended Platforms
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {analysis.analysis.recommended_platforms.map((platform, index) => (
                          <Chip key={index} label={platform} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {analysis.analysis.tips && analysis.analysis.tips.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tips
                      </Typography>
                      <List dense>
                        {analysis.analysis.tips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <Info color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Enter a hashtag to analyze its performance potential
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && platforms?.platforms && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Platform Recommendations
          </Typography>

          {Object.entries(platforms.platforms).map(([platformKey, platformData]) => (
            <Accordion key={platformKey} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {platformKey}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Recommended Count:</strong> {platformData.recommended_count} hashtags
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Tips:</strong>
                    </Typography>
                    <List dense>
                      {platformData.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    {/* <Dialog open={showDebug} onClose={() => setShowDebug(false)} maxWidth="md" fullWidth>
        <DialogTitle>API Debug Information</DialogTitle>
        <DialogContent>
          <APIConnectionTest />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Current State:</Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify({
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                platform,
                topic,
                maxHashtags,
                hashtagToAnalyze,
                activeTab,
                loading,
                error,
                hashtags: hashtags ? 'Has data' : 'No data',
                analysis: analysis ? 'Has data' : 'No data',
                platforms: platforms ? 'Has data' : 'No data'
              }, null, 2)}
            </pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDebug(false)}>Close</Button>
        </DialogActions>
      </Dialog> */}
    </Container>
  );
};

export default HashtagGenerator;