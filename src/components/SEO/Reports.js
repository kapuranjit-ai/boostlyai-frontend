// src/components/SEO/Reports.js
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
  Download, 
  TrendingUp, 
  Visibility,
  Schedule,
  Assessment
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { seoAPI } from '../../services/api';
import { projectAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function Reports() {
  const [reportType, setReportType] = useState('seo');
  const [period, setPeriod] = useState('7days');
  const [projectId, setProjectId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { data, error, loading, callApi } = useApi();

  const generateReport = async () => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    console.log('Dates being sent:');
    console.log('Start:', startDate.toISOString());
    console.log('End:', endDate.toISOString());
    console.log('Project ID:', projectId || 1);
        
    // Set dates based on period
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    let apiCall;
    switch (reportType) {
      case 'seo':
        apiCall = () => projectAPI.getSEOReport(projectId || 1, startDate.toISOString(), endDate.toISOString());
        break;
      case 'smo':
        apiCall = () => projectAPI.getSMOReport(projectId || 1, startDate.toISOString(), endDate.toISOString());
        break;
      case 'comprehensive':
        apiCall = () => projectAPI.getComprehensiveReport(projectId || 1, startDate.toISOString(), endDate.toISOString());
        break;
      default:
        apiCall = () => projectAPI.getSEOReport(projectId || 1, startDate.toISOString(), endDate.toISOString());
    }

    await callApi(apiCall, `${reportType.toUpperCase()} report generated successfully!`);
  };

  const MetricCard = ({ title, value, change, icon, color }) => (
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
        Analytics & Reports
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate comprehensive reports to track your SEO and social media performance
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="SEO Reports" />
          <Tab label="Social Media Reports" />
          <Tab label="Comprehensive Reports" />
        </Tabs>

        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="seo">SEO Report</MenuItem>
                <MenuItem value="smo">Social Media Report</MenuItem>
                <MenuItem value="comprehensive">Comprehensive Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={projectId}
                label="Project"
                onChange={(e) => setProjectId(e.target.value)}
              >
                <MenuItem value="">All Projects</MenuItem>
                <MenuItem value="1">Website Project</MenuItem>
                <MenuItem value="2">Blog Project</MenuItem>
                <MenuItem value="3">E-commerce Project</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={generateReport}
              disabled={loading}
              startIcon={<Analytics />}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={generateReport} />
      )}

      {loading && <Loading message="Generating report..." />}

      {data && (
        <Box>
          {/* Overview Metrics */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            Performance Overview
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Overall Score"
                value={`${data.overall_score || data.seo?.overall_score || 0}/100`}
                change={5}
                icon={<Assessment />}
                color="#2563eb"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Keywords in Top 10"
                value={data.seo?.keywords?.top_10 || 0}
                change={12}
                icon={<TrendingUp />}
                color="#059669"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Engagement"
                value={data.smo?.engagement?.total || 0}
                change={8}
                icon={<Visibility />}
                color="#dc2626"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Avg. Position"
                value="#15.3"
                change={-2}
                icon={<Schedule />}
                color="#7c3aed"
              />
            </Grid>
          </Grid>

          {/* Detailed Report */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Detailed Analysis
            </Typography>
            
            {data.recommendations && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Recommendations
                </Typography>
                {data.recommendations.map((rec, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        mt: 0.75,
                        mr: 1.5
                      }}
                    />
                    <Typography variant="body2">
                      {rec}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {data.key_insights && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Key Insights
                </Typography>
                {data.key_insights.map((insight, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        mt: 0.75,
                        mr: 1.5
                      }}
                    />
                    <Typography variant="body2">
                      {insight}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ mt: 3 }}
            >
              Download PDF Report
            </Button>
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
            No reports generated yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate your first report to see detailed analytics and performance insights
          </Typography>
          <Button
            variant="contained"
            onClick={generateReport}
            startIcon={<Analytics />}
          >
            Generate First Report
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Reports;