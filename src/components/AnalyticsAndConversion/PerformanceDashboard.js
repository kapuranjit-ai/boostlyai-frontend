// src/pages/PerformanceDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Analytics as AnalyticsIcon,
  Article as ArticleIcon,
  Share as ShareIcon,
  Lightbulb as LightbulbIcon,
  Traffic as TrafficIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { seoAPI } from '../../services/api';

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [trafficForecast, setTrafficForecast] = useState(null);
  const [projectPerformance, setProjectPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, forecastRes, projectsRes] = await Promise.all([
        seoAPI.getPerformanceMetrics(),
        seoAPI.getTrafficForecast(),
        seoAPI.getProjectPerformance()
      ]);

      setMetrics(metricsRes.data);
      setTrafficForecast(forecastRes.data);
      setProjectPerformance(projectsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert severity="info">
        No performance data available. Start analyzing your projects to see metrics.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Performance Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Traffic Forecast" />
        <Tab label="Project Performance" />
      </Tabs>

      {activeTab === 0 && (
        <OverviewTab 
          metrics={metrics} 
          trafficForecast={trafficForecast} 
        />
      )}

      {activeTab === 1 && (
        <TrafficForecastTab 
          trafficForecast={trafficForecast} 
        />
      )}

      {activeTab === 2 && (
        <ProjectPerformanceTab 
          projectPerformance={projectPerformance} 
        />
      )}
    </Box>
  );
};

// Overview Tab Component
const OverviewTab = ({ metrics, trafficForecast }) => {
  return (
    <Grid container spacing={3}>
      {/* Overall Score */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Overall Performance
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" component="div">
                {metrics.overallScore}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                /100
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={metrics.overallScore} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* SEO Score */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              SEO Score
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" component="div">
                {metrics.seoScore}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                /100
              </Typography>
              {metrics.seoTrend > 0 ? (
                <TrendingUpIcon color="success" sx={{ ml: 1 }} />
              ) : (
                <TrendingDownIcon color="error" sx={{ ml: 1 }} />
              )}
              <Typography 
                variant="body2" 
                color={metrics.seoTrend > 0 ? "success.main" : "error.main"}
                sx={{ ml: 0.5 }}
              >
                {metrics.seoTrend > 0 ? `+${metrics.seoTrend}` : metrics.seoTrend}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={metrics.seoScore} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Content Quality */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Content Quality
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" component="div">
                {metrics.contentQuality}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                /100
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={metrics.contentQuality} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Social Engagement */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Social Engagement
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" component="div">
                {metrics.socialEngagement}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                /100
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={metrics.socialEngagement} 
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Recommendations */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
              AI Recommendations
            </Typography>
            <List>
              {metrics.recommendations.map((rec, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {rec.priority === 'high' ? (
                        <Chip label="High" color="error" size="small" />
                      ) : rec.priority === 'medium' ? (
                        <Chip label="Medium" color="warning" size="small" />
                      ) : (
                        <Chip label="Low" color="success" size="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={rec.title} 
                      secondary={rec.description}
                    />
                  </ListItem>
                  {index < metrics.recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Traffic Overview */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <TrafficIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
              Traffic Overview
            </Typography>
            {trafficForecast && (
              <>
                <Typography variant="h4" gutterBottom>
                  {Math.round(trafficForecast.baselineForecast[0] || 0).toLocaleString()}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Current Monthly Visitors
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Potential Gain: {trafficForecast.potentialGain.toLocaleString()} visitors
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ROI Potential: +{trafficForecast.roiPercentage}%
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Traffic Forecast Tab Component
const TrafficForecastTab = ({ trafficForecast }) => {
  if (!trafficForecast) {
    return (
      <Alert severity="info">
        No traffic forecast data available.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Traffic Forecast ({trafficForecast.forecastMonths} months)
            </Typography>
            
            {/* Forecast Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {Math.round(trafficForecast.baselineForecast.reduce((a, b) => a + b, 0)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Baseline Forecast
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {Math.round(trafficForecast.improvedForecast.reduce((a, b) => a + b, 0)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    With Improvements
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {Math.round(trafficForecast.optimalForecast.reduce((a, b) => a + b, 0)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Optimal Scenario
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* ROI Potential */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'success.light' }}>
              <Typography variant="h6" gutterBottom>
                ROI Opportunity
              </Typography>
              <Typography>
                Implementing our recommendations could generate an additional{' '}
                <strong>{trafficForecast.potentialGain.toLocaleString()}</strong> visitors
                with a potential ROI of <strong>+{trafficForecast.roiPercentage}%</strong>.
              </Typography>
            </Paper>

            {/* Monthly Breakdown */}
            <Typography variant="h6" gutterBottom>
              Monthly Projections
            </Typography>
            <Grid container spacing={1}>
              {trafficForecast.baselineForecast.map((value, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Month {index + 1}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Baseline: {Math.round(value).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="success.main" gutterBottom>
                      Improved: {Math.round(trafficForecast.improvedForecast[index]).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      Optimal: {Math.round(trafficForecast.optimalForecast[index]).toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Project Performance Tab Component
const ProjectPerformanceTab = ({ projectPerformance }) => {
  if (!projectPerformance || projectPerformance.length === 0) {
    return (
      <Alert severity="info">
        No project performance data available. Analyze your projects to see performance metrics.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {projectPerformance.map((project) => (
        <Grid item xs={12} md={6} lg={4} key={project.projectId}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {project.projectName}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Last analyzed: {new Date(project.lastAnalyzed).toLocaleDateString()}
                </Typography>
              </Box>

              {/* SEO Score */}
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  SEO Score: {project.seoScore}/100
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={project.seoScore} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              {/* Traffic */}
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  Traffic Estimate: {project.trafficEstimate.toLocaleString()} visitors
                </Typography>
                <Box display="flex" alignItems="center">
                  {project.trafficTrend > 0 ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" />
                  )}
                  <Typography 
                    variant="body2" 
                    color={project.trafficTrend > 0 ? "success.main" : "error.main"}
                    sx={{ ml: 0.5 }}
                  >
                    {project.trafficTrend > 0 ? `+${project.trafficTrend}` : project.trafficTrend}
                  </Typography>
                </Box>
              </Box>

              {/* Performance Status */}
              <Box mt={2}>
                {project.seoScore >= 80 ? (
                  <Chip label="Excellent" color="success" size="small" />
                ) : project.seoScore >= 60 ? (
                  <Chip label="Good" color="warning" size="small" />
                ) : (
                  <Chip label="Needs Improvement" color="error" size="small" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PerformanceDashboard;