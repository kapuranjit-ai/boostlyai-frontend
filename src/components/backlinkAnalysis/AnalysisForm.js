// components/BacklinkAnalysis/AnalysisForm.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Alert,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Link,
  History,
  Search,
  AutoAwesome
} from '@mui/icons-material';
import { useBacklinkAnalysis } from '../backlinkAnalysis/useBacklinkAnalysis';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function BacklinkAnalysisForm() {
  const [url, setUrl] = useState('');
  const [competitors, setCompetitors] = useState('');
  const { loading, error, data, analyzeBacklinks } = useBacklinkAnalysis();

  const handleAnalysis = async () => {
    const competitorsList = competitors.split('\n').filter(item => item.trim());
    await analyzeBacklinks(url, competitorsList);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Backlink Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Competitor URLs (one per line)"
              placeholder="https://competitor1.com\nhttps://competitor2.com"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This analysis will examine backlink profiles and compare them with competitors.
                The process may take several minutes to complete.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalysis}
              disabled={!url || loading}
              size="large"
              startIcon={<Search />}
            >
              {loading ? 'Analyzing...' : 'Start Backlink Analysis'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleAnalysis} />
      )}

      {loading && <Loading message="Analyzing backlinks..." />}

      {data && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Started
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2">
                  <strong>URL:</strong> {data.url}
                </Typography>
                {data.project_id && (
                  <Typography variant="body2">
                    <strong>Project ID:</strong> {data.project_id}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Status:</strong> {data.status}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" paragraph>
                  Your backlink analysis is being processed. You can check the results later using the analysis ID.
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" fontFamily="monospace">
                    Analysis ID: {data.analysis_id || 'Pending...'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default BacklinkAnalysisForm;