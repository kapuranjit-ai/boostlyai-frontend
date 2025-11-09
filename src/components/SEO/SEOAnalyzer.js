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
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { seoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function SEOAnalyzer() {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { data, error, loading, callApi } = useApi();

  const analyzeSEO = async () => {
    await callApi(
      () => seoAPI.analyzeSEO(url),
      'SEO analysis completed successfully!'
    );
  };

  const aiAnalyzeSEO = async () => {
    await callApi(
      () => seoAPI.analyzeSEOWithAI(url),
      'AI SEO analysis completed successfully!'
    );
  };

  const handleAnalyze = () => {
    if (activeTab === 0) {
      analyzeSEO();
    } else {
      aiAnalyzeSEO();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        SEO Analyzer
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Standard Analysis" />
          <Tab label="AI Analysis" />
        </Tabs>

        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalyze}
              disabled={!url || loading}
              startIcon={activeTab === 0 ? <Search /> : <AutoAwesome />}
              size="large"
            >
              {loading ? 'Analyzing...' : activeTab === 0 ? 'Analyze SEO' : 'AI Analyze'}
            </Button>
          </Grid>
        </Grid>

        {activeTab === 1 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            AI analysis provides more comprehensive insights and recommendations using advanced algorithms.
          </Alert>
        )}
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleAnalyze} />
      )}

      {loading && <Loading message="Analyzing website..." />}

      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  URL: {data.meta_data?.url}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {data.meta_data?.status_code}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Load Time: {data.meta_data?.load_time}s
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Word Count: {data.meta_data?.word_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Meta Tags
                </Typography>
                <Typography variant="subtitle2">Title</Typography>
                <Typography variant="body2" gutterBottom>
                  {data.meta_data?.title || 'No title found'}
                </Typography>
                <Typography variant="subtitle2">Description</Typography>
                <Typography variant="body2">
                  {data.meta_data?.description || 'No description found'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Suggestions ({data.suggestions?.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.suggestions?.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion.suggestion}
                      color={
                        suggestion.priority === 'high' ? 'error' :
                        suggestion.priority === 'medium' ? 'warning' : 'default'
                      }
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {data.ai_report && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Analysis Report
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    Score: {data.ai_report.overall_score}/100
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Grade: {data.ai_report.grade}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Strengths
                  </Typography>
                  <ul>
                    {data.ai_report.strengths?.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>

                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Critical Issues
                  </Typography>
                  <ul>
                    {data.ai_report.critical_issues?.map((issue, index) => (
                      <li key={index}>
                        <strong>{issue.priority}:</strong> {issue.issue} - {issue.recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default SEOAnalyzer;