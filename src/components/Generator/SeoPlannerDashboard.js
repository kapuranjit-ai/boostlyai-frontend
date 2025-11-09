// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Button,
  Chip,
} from '@mui/material';
import {
  Timeline,
  Analytics,
  Business,
  TrendingUp,
} from '@mui/icons-material';
import SEOPlanGenerator from '../Generator/SEOPlanGenerator';
import IndustriesBrowser from '../Generator/IndustriesBrowser';
import TrialStatus from '../Generator/TrialStatus';
import SEOPlanDisplay from '../Generator/SEOPlanDisplay';
import { trialApi } from '../../services/api';

const Dashboard = () => {
  const [trialStatus, setTrialStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await trialApi.getTrialStatus();
      setTrialStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch trial status:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'seo-plan':
        return <SEOPlanGenerator />;
      case 'get-plan':
        return <SEOPlanDisplay />;
      case 'industries':
        return <IndustriesBrowser />;
      case 'trial':
        return <TrialStatus  onStatusUpdate={fetchTrialStatus} />;
      default:
        return <OverviewTab trialStatus={trialStatus} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SEO Master Platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color={activeTab === 'overview' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              color={activeTab === 'seo-plan' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('seo-plan')}
            >
              SEO Plans
            </Button>
            <Button
              color={activeTab === 'get-plan' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('get-plan')}
            >
              Get Plans
            </Button>
            <Button
              color={activeTab === 'industries' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('industries')}
            >
              Industries
            </Button>
            <Button
              color={activeTab === 'trial' ? 'primary' : 'inherit'}
              onClick={() => setActiveTab('trial')}
            >
              Trial
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {renderTabContent()}
      </Container>
    </Box>
  );
};

// Update OverviewTab to accept setActiveTab as a prop
const OverviewTab = ({ trialStatus, setActiveTab }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={3}>
      <StatCard
        icon={<Timeline color="primary" />}
        title="SEO Plans"
        value="0"
        subtitle="Generated Plans"
        color="#1976d2"
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <StatCard
        icon={<Analytics color="success" />}
        title="Industries"
        value="15+"
        subtitle="Available Industries"
        color="#2e7d32"
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <StatCard
        icon={<Business color="warning" />}
        title="Keywords"
        value="500+"
        subtitle="Industry Keywords"
        color="#ed6c02"
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <StatCard
        icon={<TrendingUp color="error" />}
        title="Trial Status"
        value={trialStatus?.is_active ? 'Active' : 'Inactive'}
        subtitle={trialStatus?.days_remaining ? `${trialStatus.days_remaining} days left` : 'No trial'}
        color={trialStatus?.is_active ? '#2e7d32' : '#d32f2f'}
      />
    </Grid>

    <Grid item xs={12} md={8}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to SEO Master Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Generate comprehensive SEO plans, explore industry insights, and optimize your website's performance.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="contained" onClick={() => setActiveTab('seo-plan')}>
            Create SEO Plan
          </Button>
          <Button variant="outlined" onClick={() => setActiveTab('industries')}>
            Browse Industries
          </Button>
        </Box>
      </Paper>
    </Grid>

    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="outlined" size="small">
            View Analytics
          </Button>
          <Button variant="outlined" size="small">
            Check Keywords
          </Button>
          <Button variant="outlined" size="small">
            Generate Report
          </Button>
        </Box>
      </Paper>
    </Grid>
  </Grid>
);

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <Card sx={{ bgcolor: color + '08', border: `1px solid ${color}20` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, color: color }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

export default Dashboard;