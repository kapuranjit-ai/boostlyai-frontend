// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { 
  Search, 
  TrendingUp, 
  Share, 
  Analytics,
  ArrowForward,
  Refresh,
  Warning,
  CheckCircle,
  People,
  Error as ErrorIcon,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { dashboardAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    analyzedPages: 0,
    keywordsResearched: 0,
    socialPosts: 0,
    projects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [performance, setPerformance] = useState({
    seoScore: 0,
    contentQuality: 0,
    socialEngagement: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiContentType, setAiContentType] = useState('keyword');
  const [aiTopic, setAiTopic] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { callApi } = useApi();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Use main dashboard API methods (no project ID needed)
    const statsResponse = await dashboardAPI.getDashboardStats();
    console.log(JSON.stringify(statsResponse.data))
    
    const performanceResponse = await dashboardAPI.getPerformanceMetrics();

    if (statsResponse) {
        
    
        console.log(statsResponse.data.analyzedPages)
      setStats({
       
        analyzedPages: statsResponse.data.analyzedPages ||  0,
        keywordsResearched: statsResponse.data.keywordsResearched || 0,
        socialPosts: statsResponse.data.socialPosts  || 0,
        projects: statsResponse.data.projects || 0
      });
    
    } else {
      setStats({
        analyzedPages: 0,
        keywordsResearched: 0,
        socialPosts: 0,
        projects: 0
      });
    }

    const activityResponse = await dashboardAPI.getRecentActivity();
    if (activityResponse.data && activityResponse.data.length > 0) {
      setRecentActivity(activityResponse.data);
    } else {
      setRecentActivity([]);
    }

    if (performanceResponse.data) {
      setPerformance(performanceResponse.data);
    } else {
      setPerformance({
        seoScore: 0,
        contentQuality: 0,
        socialEngagement: 0
      });
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    setError('Failed to load dashboard data. Please check your connection.');
    
    // Fallback data
    // setStats({
    //   analyzedPages: 0,
    //   keywordsResearched: 0,
    //   socialPosts: 0,
    //   projects: 0
    // });
    setRecentActivity([]);
    setPerformance({
      seoScore: 0,
      contentQuality: 0,
      socialEngagement: 0
    });
  } finally {
    setLoading(false);
  }
};

  const generateAIContent = async () => {
    try {
      setAiLoading(true);
      setError(null);
      
      let endpoint = '';
      let data = {};
      
      switch(aiContentType) {
        case 'keyword':
          endpoint = '/api/v1/generate/keywords';
          data = { topic: aiTopic };
          break;
        case 'meta':
          endpoint = '/api/v1/generate/meta';
          data = { 
            keyword: aiTopic,
            content_type: 'article'
          };
          break;
        case 'content':
          endpoint = '/api/v1/generate/content';
          data = { topic: aiTopic };
          break;
        case 'social':
          endpoint = '/api/v1/generate/social';
          data = { 
            topic: aiTopic,
            platform: 'facebook'
          };
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      const response = await callApi({
        url: endpoint,
        method: 'POST',
        data: data
      });
      
      setAiResult(response.data);
    } catch (error) {
      console.error('Error generating AI content:', error);
      setError(`Failed to generate ${aiContentType} content. Please check your API configuration.`);
    } finally {
      setAiLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'SEO Analysis',
      description: 'Analyze website SEO performance',
      icon: <Search />,
      path: '/seo/analyzer',
      color: '#2563eb',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    },
    {
      title: 'Keyword Research',
      description: 'Discover profitable keywords',
      icon: <TrendingUp />,
      path: '/seo/keywords',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    },
    {
      title: 'Social Content',
      description: 'Create engaging social media posts',
      icon: <Share />,
      path: '/social/content',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
    },
    {
      title: 'Reports & Analytics',
      description: 'View performance insights',
      icon: <Analytics />,
      path: '/seo/reports',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    }
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: `${color}20`, 
            color: color,
            width: 48,
            height: 48
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const renderActivityContent = () => {
    if (recentActivity.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No recent activity found. Start by analyzing a website or researching keywords!
          </Typography>
        </Box>
      );
    }

    return recentActivity.map((activity, index) => (
      <Box key={index} sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 2,
        borderBottom: index < recentActivity.length - 1 ? '1px solid #e2e8f0' : 'none'
      }}>
        <Avatar sx={{ 
          bgcolor: activity.type === 'analysis' ? '#2563eb20' : 
                   activity.type === 'keyword' ? '#05966920' : 
                   activity.type === 'social' ? '#dc262620' :
                   activity.type === 'content' ? '#7c3aed20' : '#f59e0b20',
          color: activity.type === 'analysis' ? '#2563eb' : 
                 activity.type === 'keyword' ? '#059669' : 
                 activity.type === 'social' ? '#dc2626' :
                 activity.type === 'content' ? '#7c3aed' : '#f59e0b',
          width: 40,
          height: 40,
          mr: 2
        }}>
          {activity.type === 'analysis' ? <Search /> : 
           activity.type === 'keyword' ? <TrendingUp /> : 
           activity.type === 'social' ? <Share /> : 
           activity.type === 'content' ? <Analytics /> : <People />}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            {activity.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activity.time}
          </Typography>
        </Box>
        <Chip 
          icon={activity.status === 'completed' ? <CheckCircle /> : <Warning />}
          label={activity.status}
          size="small"
          color={activity.status === 'completed' ? 'success' : 'warning'}
          variant="outlined"
        />
      </Box>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="warning" 
          icon={<ErrorIcon />}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>

      {/* AI Content Generation Dialog */}
      <Dialog 
        open={aiDialogOpen} 
        onClose={() => setAiDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Generate AI Content
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Content Type"
              value={aiContentType}
              onChange={(e) => setAiContentType(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="keyword">Keyword Suggestions</MenuItem>
              <MenuItem value="meta">Meta Tags</MenuItem>
              <MenuItem value="content">Content Ideas</MenuItem>
              <MenuItem value="social">Social Media Content</MenuItem>
            </TextField>
            
            <TextField
              fullWidth
              label="Topic or Keyword"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Enter a topic or keyword"
              sx={{ mb: 2 }}
            />
            
            {aiLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            )}
            
            {aiResult && (
              <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                <Typography variant="h6" gutterBottom>
                  AI Generation Results
                </Typography>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={generateAIContent} 
            variant="contained"
            disabled={!aiTopic || aiLoading}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
            Welcome back! Here's your SEO & Social Media performance overview
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAiDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            AI Content
          </Button>
          <IconButton onClick={loadDashboardData} sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pages Analyzed"
            value={stats.analyzedPages}
            icon={<Search />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Keywords Researched"
            value={stats.keywordsResearched}
            icon={<TrendingUp />}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Social Posts"
            value={stats.socialPosts}
            icon={<Share />}
            color="#dc2626"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats.projects}
            icon={<People />}
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                background: action.gradient,
                color: 'white',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  minHeight: 140 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    width: 48,
                    height: 48,
                    mb: 2
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9, 
                    mb: 2,
                    flexGrow: 1
                  }}>
                    {action.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      color: action.color,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Performance */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {renderActivityContent()}
            </Box>
            <Button 
              fullWidth 
              variant="outlined" 
              endIcon={<ArrowForward />}
              sx={{ mt: 3 }}
              onClick={() => navigate('/seo/analyzer')}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Performance Overview
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">SEO Score</Typography>
                  <Typography variant="body2" fontWeight="bold">{performance.seoScore}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={performance.seoScore} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#059669',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Content Quality</Typography>
                  <Typography variant="body2" fontWeight="bold">{performance.contentQuality}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={performance.contentQuality} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2563eb',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Social Engagement</Typography>
                  <Typography variant="body2" fontWeight="bold">{performance.socialEngagement}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={performance.socialEngagement} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#dc2626',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Box>
            <Button 
              fullWidth 
              variant="outlined" 
              endIcon={<ArrowForward />}
              sx={{ mt: 2 }}
              onClick={() => navigate('/seo/reports')}
            >
              View Detailed Reports
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;