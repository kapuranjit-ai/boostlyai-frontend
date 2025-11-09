// src/components/Social/Analytics.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Analytics, 
  TrendingUp, 
  Visibility,
  ThumbUp,
  Share,
  Comment
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { seoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function SocialAnalytics() {
  const [platform, setPlatform] = useState('all');
  const [period, setPeriod] = useState('30days');
  const { data, error, loading, callApi } = useApi();

  const loadAnalytics = async () => {
    // This would normally call your analytics API
    // For now, we'll simulate data
    const mockData = {
      totalEngagement: 1248,
      engagementRate: 4.2,
      topPosts: [
        { content: 'Digital marketing tips for 2024', engagement: 234 },
        { content: 'SEO best practices guide', engagement: 187 },
        { content: 'Social media strategy session', engagement: 156 }
      ],
      platformBreakdown: [
        { platform: 'Facebook', percentage: 45 },
        { platform: 'Twitter', percentage: 25 },
        { platform: 'LinkedIn', percentage: 20 },
        { platform: 'Instagram', percentage: 10 }
      ]
    };
    
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData }), 1000);
    });
  };

  const handleLoadAnalytics = async () => {
    await callApi(loadAnalytics, 'Analytics data loaded successfully!');
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: 3
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
            {change && (
              <Chip
                label={change > 0 ? `+${change}%` : `${change}%`}
                size="small"
                color={change > 0 ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ 
            bgcolor: `${color}20`, 
            color: color,
            p: 1.5,
            borderRadius: 2
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Social Media Analytics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Track and analyze your social media performance across all platforms
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value)}
              >
                <MenuItem value="all">All Platforms</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={period}
                label="Time Period"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLoadAnalytics}
              disabled={loading}
              startIcon={<Analytics />}
            >
              Load Analytics
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleLoadAnalytics} />
      )}

      {loading && <Loading message="Loading analytics data..." />}

      {data && (
        <Box>
          {/* Overview Metrics */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            Performance Overview
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Engagement"
                value={data.totalEngagement}
                change={12}
                icon={<TrendingUp />}
                color="#2563eb"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Engagement Rate"
                value={`${data.engagementRate}%`}
                change={4.2}
                icon={<Visibility />}
                color="#059669"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg. Likes"
                value="89"
                change={8}
                icon={<ThumbUp />}
                color="#dc2626"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg. Shares"
                value="23"
                change={15}
                icon={<Share />}
                color="#7c3aed"
              />
            </Grid>
          </Grid>

          {/* Top Performing Posts */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Top Performing Posts
            </Typography>
            {data.topPosts.map((post, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 2,
                borderBottom: index < data.topPosts.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {post.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.engagement} engagements
                  </Typography>
                </Box>
                <Chip 
                  label={`#${index + 1}`} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            ))}
          </Paper>

          {/* Platform Breakdown */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Platform Performance
            </Typography>
            {data.platformBreakdown.map((platform, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{platform.platform}</Typography>
                  <Typography variant="body2" fontWeight="bold">{platform.percentage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={platform.percentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: index === 0 ? '#2563eb' : 
                               index === 1 ? '#1da1f2' : 
                               index === 2 ? '#0a66c2' : '#e4405f',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {!data && !loading && (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <Analytics sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            No analytics data yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Load analytics data to see your social media performance insights
          </Typography>
          <Button
            variant="contained"
            onClick={handleLoadAnalytics}
            startIcon={<Analytics />}
          >
            Load Analytics Data
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default SocialAnalytics;