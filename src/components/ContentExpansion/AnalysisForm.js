// components/CompetitiveAnalysis/AnalysisForm.js
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
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Link,
  AdsClick,
  People,
  AutoAwesome
} from '@mui/icons-material';
import { useCompetitiveAnalysis } from '../ContentExpansion/useCompetitiveAnalysis'
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function CompetitiveAnalysisForm() {
  const [yourSite, setYourSite] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error, data, analyzeCompetitors, analyzeKeywords, analyzeBacklinks, analyzeAds, analyzeSocial } = useCompetitiveAnalysis();

  const handleAnalysis = async () => {
    const competitorsList = competitors.split('\n').filter(url => url.trim());
    
    switch (activeTab) {
      case 0:
        await analyzeCompetitors(yourSite, competitorsList);
        break;
      case 1:
        await analyzeKeywords(yourSite, competitorsList);
        break;
      case 2:
        await analyzeBacklinks(yourSite, competitorsList);
        break;
      case 3:
        await analyzeAds(yourSite, competitorsList);
        break;
      case 4:
        await analyzeSocial(yourSite, competitorsList);
        break;
      default:
        break;
    }
  };

  const analysisTypes = [
    { label: 'Comprehensive', icon: <AutoAwesome />, description: 'Full competitive analysis' },
    { label: 'Keywords', icon: <Search />, description: 'Keyword gap analysis' },
    { label: 'Backlinks', icon: <Link />, description: 'Backlink profile comparison' },
    { label: 'Ads', icon: <AdsClick />, description: 'Advertising strategy analysis' },
    { label: 'Social', icon: <People />, description: 'Social media presence analysis' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Competitive Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          {analysisTypes.map((type, index) => (
            <Tab key={index} label={type.label} icon={type.icon} iconPosition="start" />
          ))}
        </Tabs>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Your Website URL"
              placeholder="https://yourwebsite.com"
              value={yourSite}
              onChange={(e) => setYourSite(e.target.value)}
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
                <strong>{analysisTypes[activeTab].label} Analysis:</strong> {analysisTypes[activeTab].description}
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalysis}
              disabled={!yourSite || loading}
              size="large"
              startIcon={analysisTypes[activeTab].icon}
            >
              {loading ? 'Analyzing...' : `Start ${analysisTypes[activeTab].label} Analysis`}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleAnalysis} />
      )}

      {loading && <Loading message="Performing competitive analysis..." />}

      {data && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Started
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Analysis Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Analysis ID:</strong> {data.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> 
                    <Chip 
                      label={data.status} 
                      size="small" 
                      color={data.status === 'completed' ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Your Site:</strong> {yourSite}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Competitors:</strong> {competitors.split('\n').filter(url => url.trim()).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Next Steps
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Your analysis is being processed. You can check the results using the analysis ID:
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" fontFamily="monospace">
                      {data.id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default CompetitiveAnalysisForm;