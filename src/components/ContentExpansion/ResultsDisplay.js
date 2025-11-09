// components/CompetitiveAnalysis/ResultsDisplay.js
import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search,
  Refresh,
  ExpandMore,
  TrendingUp,
  Link as LinkIcon,
  AdsClick,
  People,
  EmojiEvents,
  Insights,
  Lightbulb
} from '@mui/icons-material';
import { useCompetitiveAnalysis } from '../ContentExpansion/useCompetitiveAnalysis';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function ResultsDisplay() {
  const [analysisId, setAnalysisId] = useState('');
  const { loading, error, data, getResults, checkAnalysisStatus, analysisStatus } = useCompetitiveAnalysis();
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleGetResults = async () => {
    await getResults(analysisId);
  };

  const handleCheckStatus = async () => {
    await checkAnalysisStatus(analysisId);
  };

  useEffect(() => {
    // Clear interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const startPolling = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    const interval = setInterval(() => {
      checkAnalysisStatus(analysisId);
    }, 5000); // Check every 5 seconds
    
    setRefreshInterval(interval);
  };

  const stopPolling = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  useEffect(() => {
    if (analysisStatus[analysisId]?.status === 'completed') {
      stopPolling();
      getResults(analysisId);
    }
  }, [analysisStatus, analysisId, getResults]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Competitive Analysis Results
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Analysis ID"
              placeholder="Enter analysis ID"
              value={analysisId}
              onChange={(e) => setAnalysisId(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGetResults}
              disabled={!analysisId || loading}
              startIcon={<Search />}
              size="large"
            >
              {loading ? 'Loading...' : 'Get Results'}
            </Button>
          </Grid>
        </Grid>

        {analysisStatus[analysisId] && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={analysisStatus[analysisId].status === 'completed' ? 'success' : 'info'}>
              <Typography variant="body2">
                Status: {analysisStatus[analysisId].status}
              </Typography>
              {analysisStatus[analysisId].status === 'pending' && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={startPolling}
                  startIcon={<Refresh />}
                  sx={{ mt: 1 }}
                >
                  Auto Refresh
                </Button>
              )}
            </Alert>
          </Box>
        )}
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleGetResults} />
      )}

      {loading && <Loading message="Loading analysis results..." />}

      {data && data.status === 'completed' && data.results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Analysis ID: {data.id} | Completed at: {new Date(data.completed_at).toLocaleString()}
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Summary" />
            <Tab label="Keyword Analysis" />
            <Tab label="Backlink Analysis" />
            <Tab label="Ad Analysis" />
            <Tab label="Social Analysis" />
            <Tab label="Recommendations" />
          </Tabs>

          {activeTab === 0 && <SummaryTab results={data.results} />}
          {activeTab === 1 && <KeywordAnalysisTab results={data.results} />}
          {activeTab === 2 && <BacklinkAnalysisTab results={data.results} />}
          {activeTab === 3 && <AdAnalysisTab results={data.results} />}
          {activeTab === 4 && <SocialAnalysisTab results={data.results} />}
          {activeTab === 5 && <RecommendationsTab results={data.results} />}
        </Paper>
      )}

      {data && data.status === 'pending' && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Analysis in Progress
          </Typography>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Your analysis is being processed. Please check back later.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleCheckStatus}
            startIcon={<Refresh />}
            sx={{ mt: 2 }}
          >
            Check Status
          </Button>
        </Paper>
      )}
    </Box>
  );
}

// Summary Tab Component
// Summary Tab Component
function SummaryTab({ results }) {
  if (!results.comparative_data) return <Typography>No summary data available</Typography>;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Overall Performance Summary
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(results.comparative_data).map(([site, data], index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {site.split('/')[2] || site}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Keyword Score:</Typography>
                  <Chip 
                    label={calculateKeywordScore(data.keyword_rankings)} 
                    color="primary"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Backlink Score:</Typography>
                  <Chip 
                    label={data.backlinks ? data.backlinks.authority_score : 'N/A'} 
                    color={data.backlinks && data.backlinks.authority_score > 40 ? "success" : data.backlinks && data.backlinks.authority_score > 20 ? "warning" : "error"}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Ad Intensity:</Typography>
                  <Chip 
                    label={data.ad_data ? data.ad_data.ad_intensity : 'N/A'} 
                    color={data.ad_data && data.ad_data.ad_intensity > 3 ? "success" : data.ad_data && data.ad_data.ad_intensity > 2 ? "warning" : "error"}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Social Score:</Typography>
                  <Chip 
                    label={calculateSocialScore(data.social_presence)} 
                    color="primary"
                    size="small"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Overall Score:</Typography>
                  <Chip 
                    label={calculateOverallScore(data)} 
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="body2" color="text.secondary">
        Analysis generated at: {results.generated_at}
      </Typography>
    </Box>
  );
}

// Helper functions for scoring
function calculateKeywordScore(keywordRankings) {
  if (!keywordRankings) return 'N/A';
  const ranks = Object.values(keywordRankings).map(k => k.rank);
  const avgRank = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  return Math.max(0, 100 - (avgRank * 10));
}

function calculateSocialScore(socialPresence) {
  if (!socialPresence) return 'N/A';
  const platforms = Object.values(socialPresence);
  const totalFollowers = platforms.reduce((sum, platform) => sum + (platform.followers || 0), 0);
  return Math.min(100, Math.floor(totalFollowers / 1000));
}

function calculateOverallScore(siteData) {
  const keywordScore = calculateKeywordScore(siteData.keyword_rankings);
  const backlinkScore = siteData.backlinks ? siteData.backlinks.authority_score : 0;
  const socialScore = calculateSocialScore(siteData.social_presence);
  const adScore = siteData.ad_data ? siteData.ad_data.ad_intensity * 20 : 0;
  
  return Math.round((keywordScore + backlinkScore + socialScore + adScore) / 4);
}

// Keyword Analysis Tab Component
// Keyword Analysis Tab Component
function KeywordAnalysisTab({ results }) {
  if (!results.comparative_data) return <Typography>No keyword data available</Typography>;
  
  const yourSite = results.your_site;
  const competitors = results.competitors;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Keyword Analysis
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Keyword Rankings Comparison</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell>Volume</TableCell>
                  {[yourSite, ...competitors].map((site, index) => (
                    <TableCell key={index}>{site.split('/')[2] || site}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllKeywords(results.comparative_data).map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword}</TableCell>
                    <TableCell>{getKeywordVolume(results.comparative_data, keyword)}</TableCell>
                    {[yourSite, ...competitors].map((site, siteIndex) => (
                      <TableCell key={siteIndex}>
                        {results.comparative_data[site]?.keyword_rankings?.[keyword]?.rank || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      
      {results.ai_insights && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>AI Insights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom>Summary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {results.ai_insights.summary}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
            <List dense>
              {results.ai_insights.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Lightbulb color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

// Helper function to get all unique keywords
function getAllKeywords(comparativeData) {
  const allKeywords = new Set();
  Object.values(comparativeData).forEach(site => {
    if (site.keyword_rankings) {
      Object.keys(site.keyword_rankings).forEach(keyword => {
        allKeywords.add(keyword);
      });
    }
  });
  return Array.from(allKeywords);
}

// Helper function to get keyword volume
function getKeywordVolume(comparativeData, keyword) {
  for (const site of Object.values(comparativeData)) {
    if (site.keyword_rankings && site.keyword_rankings[keyword]) {
      return site.keyword_rankings[keyword].volume;
    }
  }
  return 'N/A';
}

// Backlink Analysis Tab Component
function BacklinkAnalysisTab({ results }) {
  if (!results.comparative_data) return <Typography>No backlink data available</Typography>;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Backlink Analysis
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(results.comparative_data).map(([site, data], index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {site.split('/')[2] || site}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Backlinks:</Typography>
                  <Typography variant="body2">{data.backlinks?.count || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Referring Domains:</Typography>
                  <Typography variant="body2">{data.backlinks?.referring_domains || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Authority Score:</Typography>
                  <Chip 
                    label={data.backlinks?.authority_score || 'N/A'} 
                    color={data.backlinks?.authority_score > 40 ? "success" : data.backlinks?.authority_score > 20 ? "warning" : "error"}
                    size="small"
                  />
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Top Backlinks:</Typography>
                <List dense>
                  {data.backlinks?.top_backlinks?.slice(0, 3).map((backlink, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <LinkIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={backlink.split('/')[2] || backlink} 
                        secondary={backlink}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Ad Analysis Tab Component
// Ad Analysis Tab Component
function AdAnalysisTab({ results }) {
  if (!results.ad_data) return <Typography>No ad data available</Typography>;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Advertising Analysis
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Ad Performance by Site</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Estimated Ad Presence</TableCell>
                  <TableCell>Ad Intensity</TableCell>
                  <TableCell>Ad Keywords</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(results.ad_data).map(([site, data], index) => {
                  // Skip the insights and charts properties
                  if (site === 'insights' || site === 'charts' || site === 'generated_at' || site === 'analysis_type') return null;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{site.split('/')[2] || site}</TableCell>
                      <TableCell>{data.estimated_ad_presence}</TableCell>
                      <TableCell>{data.ad_intensity}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {data.ad_keywords && data.ad_keywords.slice(0, 5).map((keyword, i) => (
                            <Chip key={i} label={keyword} size="small" variant="outlined" />
                          ))}
                          {data.ad_keywords && data.ad_keywords.length > 5 && (
                            <Chip label={`+${data.ad_keywords.length - 5} more`} size="small" />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      
      {results.ad_data.insights && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Ad Insights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Ad Presence: {results.ad_data.insights.estimated_ad_presence}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Ad Intensity: {results.ad_data.insights.ad_intensity}
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
            <List dense>
              {results.ad_data.insights.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Lightbulb color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      
      {results.ad_data.charts && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Ad Presence Chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={`data:image/png;base64,${results.ad_data.charts.ad_presence_chart}`} 
                alt="Ad Presence Chart" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

// Social Analysis Tab Component
// Social Analysis Tab Component
function SocialAnalysisTab({ results }) {
  if (!results.comparative_data) return <Typography>No social data available</Typography>;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Social Media Analysis
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Social Performance by Platform</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Followers</TableCell>
                  <TableCell>Engagement Rate</TableCell>
                  <TableCell>Activity Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(results.comparative_data).map(([site, data]) => (
                  data.social_presence && Object.entries(data.social_presence).map(([platform, stats], index) => (
                    stats.exists && (
                      <TableRow key={`${site}-${platform}`}>
                        <TableCell>{site.split('/')[2] || site}</TableCell>
                        <TableCell>{platform.charAt(0).toUpperCase() + platform.slice(1)}</TableCell>
                        <TableCell>{stats.followers.toLocaleString()}</TableCell>
                        <TableCell>{(stats.engagement_rate * 100).toFixed(2)}%</TableCell>
                        <TableCell>
                          <Chip 
                            label={stats.activity_level} 
                            color={stats.activity_level === 'high' ? "success" : stats.activity_level === 'medium' ? "warning" : "error"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  ))
                )).flat().filter(Boolean)}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

// Recommendations Tab Component
// Recommendations Tab Component
function RecommendationsTab({ results }) {
  if (!results.action_plan) return <Typography>No recommendations available</Typography>;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Strategic Recommendations
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Action Plan
          </Typography>
          <List>
            {results.action_plan.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Lightbulb color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={item.action}
                  secondary={`Priority: ${item.priority} | Category: ${item.category} | Timeline: ${item.timeline}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {results.ai_insights && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              AI Insights
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {results.ai_insights.summary}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
            <List dense>
              {results.ai_insights.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Lightbulb color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {results.roi_analysis && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              ROI Analysis
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Estimated Monthly Traffic:</Typography>
              <Typography variant="body2">{results.roi_analysis.estimated_monthly_traffic.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Conversion Rate:</Typography>
              <Typography variant="body2">{(results.roi_analysis.conversion_rate * 100).toFixed(2)}%</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Potential Revenue:</Typography>
              <Typography variant="body2">${results.roi_analysis.potential_revenue.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">ROI Percentage:</Typography>
              <Typography variant="body2">{results.roi_analysis.roi_percentage}%</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Confidence:</Typography>
              <Chip 
                label={results.roi_analysis.confidence} 
                color={results.roi_analysis.confidence === 'high' ? "success" : results.roi_analysis.confidence === 'medium' ? "warning" : "error"}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ResultsDisplay;