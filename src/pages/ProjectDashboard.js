// src/components/ProjectDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Domain as DomainIcon,
  Groups as GroupsIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { projectAPI } from '../services/api';

const ProjectDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    userMappings: [],
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch projects and user mappings
      const [projectsResponse, userMappingsResponse] = await Promise.all([
        projectAPI.getProjects(),
        projectAPI.getUserProjectMappings() // Get current user's mappings
      ]);

      const projects = projectsResponse.data?.projects || [];
      const userMappings = userMappingsResponse.data?.mappings || [];
      
      console.log('Dashboard Data:', { projects, userMappings }); // Debug log
      
      // Calculate stats from real data
      const stats = calculateStats(projects, userMappings);
      
      setDashboardData({
        projects,
        userMappings,
        stats
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projects, mappings) => {
    const totalProjects = projects.length;
    const totalMembers = mappings.length;
    
    // Count roles from user mappings
    const roleCounts = mappings.reduce((acc, mapping) => {
      acc[mapping.role] = (acc[mapping.role] || 0) + 1;
      return acc;
    }, {});
    
    // Count industries from projects
    const industryCounts = projects.reduce((acc, project) => {
      if (project.industry) {
        acc[project.industry] = (acc[project.industry] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Recent projects (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const recentProjects = projects.filter(project => {
      const createdDate = new Date(project.created_at);
      return createdDate > monthAgo;
    }).length;

    // Get top industry
    const topIndustryEntry = Object.entries(industryCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b, ['None', 0]
    );

    return {
      totalProjects,
      totalMembers,
      roleCounts,
      industryCounts,
      recentProjects,
      topIndustry: topIndustryEntry[0],
      topIndustryCount: topIndustryEntry[1]
    };
  };

  const generateRecentActivity = (projects) => {
    if (!projects || projects.length === 0) return [];
    
    const activities = [];
    
    projects.slice(0, 5).forEach(project => {
      if (project.created_at) {
        activities.push({
          id: project.id,
          title: `Project "${project.name}" created`,
          time: new Date(project.created_at).toLocaleDateString(),
          type: 'project_created'
        });
      }
    });
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'primary',
      admin: 'secondary',
      member: 'default',
      guest: 'warning'
    };
    return colors[role] || 'default';
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'E-commerce': 'success',
      'Healthcare': 'error',
      'Education': 'warning',
      'Technology': 'info',
      'Finance': 'primary',
      'Retail': 'secondary'
    };
    return colors[industry] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={fetchDashboardData}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const { projects, stats, userMappings } = dashboardData;
  const recentActivity = generateRecentActivity(projects);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Project Dashboard
        </Typography>
        <IconButton onClick={fetchDashboardData} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Projects */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" component="div" color="white" fontWeight="bold">
                    {stats?.totalProjects || 0}
                  </Typography>
                  <Typography color="white" variant="body2" sx={{ opacity: 0.9 }}>
                    Total Projects
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Team Members */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" component="div" color="white" fontWeight="bold">
                    {stats?.totalMembers || 0}
                  </Typography>
                  <Typography color="white" variant="body2" sx={{ opacity: 0.9 }}>
                    Team Members
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" component="div" color="white" fontWeight="bold">
                    {stats?.recentProjects || 0}
                  </Typography>
                  <Typography color="white" variant="body2" sx={{ opacity: 0.9 }}>
                    New This Month
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Industry */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h5" component="div" color="white" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                    {stats?.topIndustry || 'None'}
                  </Typography>
                  <Typography color="white" variant="body2" sx={{ opacity: 0.9 }}>
                    {stats?.topIndustryCount || 0} projects
                  </Typography>
                </Box>
                <AnalyticsIcon sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Projects List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Your Projects ({projects.length})
                </Typography>
              </Box>
              
              {projects.length === 0 ? (
                <Typography color="textSecondary" textAlign="center" py={4}>
                  No projects found. Create your first project to get started.
                </Typography>
              ) : (
                <List>
                  {projects.slice(0, 5).map((project, index) => (
                    <React.Fragment key={project.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <DomainIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6" component="span">
                                {project.name}
                              </Typography>
                              {project.my_role && (
                                <Chip 
                                  label={project.my_role} 
                                  size="small" 
                                  color={getRoleColor(project.my_role)}
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                {project.domain} • {project.industry}
                              </Typography>
                              <Typography variant="body2">
                                {project.target_audience}
                              </Typography>
                              {project.created_at && (
                                <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                                  Created: {new Date(project.created_at).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < Math.min(projects.length - 1, 4) && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Stats & Activity */}
        <Grid item xs={12} md={4}>
          {/* Role Distribution */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <GroupsIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6" component="h3">
                  Your Roles
                </Typography>
              </Box>
              
              {stats?.roleCounts && Object.keys(stats.roleCounts).length > 0 ? (
                <Box>
                  {Object.entries(stats.roleCounts).map(([role, count]) => (
                    <Box key={role} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip 
                        label={role} 
                        size="small" 
                        color={getRoleColor(role)}
                        variant="outlined"
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {count} project(s)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No role data available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Industry Distribution */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6" component="h3">
                  Project Industries
                </Typography>
              </Box>
              
              {stats?.industryCounts && Object.keys(stats.industryCounts).length > 0 ? (
                <Box>
                  {Object.entries(stats.industryCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([industry, count]) => (
                      <Box key={industry} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Chip 
                          label={industry} 
                          size="small" 
                          color={getIndustryColor(industry)}
                          variant="outlined"
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {count}
                        </Typography>
                      </Box>
                    ))
                  }
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No industry data available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" component="h3">
                  Recent Activity
                </Typography>
              </Box>
              
              {recentActivity.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No recent activity
                </Typography>
              ) : (
                <List dense>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {activity.title}
                          </Typography>
                        }
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDashboard;