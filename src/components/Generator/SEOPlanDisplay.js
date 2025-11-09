// src/components/SEOPlanDisplay.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  CircularProgress,
  Button,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle,
  TrendingUp,
  CalendarToday,
  Assignment,
  ArrowBack,
  Search,
  Task
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { seoPlanApi } from '../../services/api';

const SEOPlanDisplay = () => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePhase, setActivePhase] = useState(0);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [planIdInput, setPlanIdInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const { plan_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (plan_id) {
      setPlanIdInput(plan_id);
      fetchPlanDetails(plan_id);
    }
  }, [plan_id]);

  const fetchPlanDetails = async (planId) => {
    setLoading(true);
    setError('');
    try {
      const response = await seoPlanApi.getPlanDetails(planId);
      setPlanData(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to fetch plan details');
      console.error('Error fetching plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanIdSubmit = (e) => {
    e.preventDefault();
    if (planIdInput.trim()) {
      fetchPlanDetails(planIdInput.trim());
    }
  };

  const handleWeekAccordionChange = (week) => (event, isExpanded) => {
    setExpandedWeek(isExpanded ? week : null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const ProgressBarWithLabel = ({ value, label }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ height: 8, borderRadius: 5 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );

  // Extract data from the nested structure
  const plan = planData?.plan || {};
  const tasks = planData?.tasks || [];
  const phasesData = plan?.phases || {};
  const phases = phasesData.phases || [];
  const weekly_schedule = phasesData.weekly_schedule || [];
  const kpis = phasesData.key_performance_indicators || {};
  const industry_keywords = phasesData.industry_keywords || [];

  // Group tasks by week
  const tasksByWeek = {};
  tasks.forEach(task => {
    if (!tasksByWeek[task.week_number]) {
      tasksByWeek[task.week_number] = [];
    }
    tasksByWeek[task.week_number].push(task);
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back button */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Plan ID Input Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Retrieve SEO Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Enter a Plan ID to view its details
        </Typography>
        
        <Box component="form" onSubmit={handlePlanIdSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Plan ID"
            value={planIdInput}
            onChange={(e) => setPlanIdInput(e.target.value)}
            placeholder="Enter plan ID"
            fullWidth
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<Search />}
            disabled={loading}
            sx={{ minWidth: '120px', height: '56px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Plan'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {planData && !loading && (
        <>
          {/* Tabs for Plan Overview and Tasks */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Plan Overview" />
              <Tab label="Task Management" icon={<Task />} iconPosition="start" />
            </Tabs>
          </Paper>

          {activeTab === 0 ? (
            <>
              {/* Plan Overview */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Goal: Increase traffic from {plan.current_traffic} to {plan.target_traffic} visitors
                  within {plan.timeframe?.replace('_', ' ')} months
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip icon={<CalendarToday />} label={`Start: ${plan.start_date}`} variant="outlined" />
                  <Chip icon={<CalendarToday />} label={`End: ${plan.end_date}`} variant="outlined" />
                  <Chip icon={<TrendingUp />} label={`Target: ${plan.target_traffic} visitors`} variant="outlined" />
                  <Chip label={`Type: ${plan.plan_type}`} variant="outlined" color="primary" />
                  <Chip label={`Status: ${plan.status}`} variant="outlined" 
                        color={plan.status === 'active' ? 'success' : 'default'} />
                </Box>
              </Paper>

              {/* Phases Stepper */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Plan Phases
                </Typography>
                
                <Stepper activeStep={activePhase} orientation="vertical">
                  {phases.map((phase, index) => (
                    <Step key={index}>
                      <StepLabel onClick={() => setActivePhase(index)} sx={{ cursor: 'pointer' }}>
                        <Typography variant="h6">{phase.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {phase.start_date} to {phase.end_date} ({phase.duration})
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" paragraph>
                          Objectives:
                        </Typography>
                        <List dense>
                          {phase.objectives.map((objective, objIndex) => (
                            <ListItem key={objIndex}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircle color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={objective} />
                            </ListItem>
                          ))}
                        </List>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>

              {/* Weekly Schedule */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Weekly Schedule
                </Typography>
                
                {weekly_schedule.map((week) => (
                  <Accordion 
                    key={week.week} 
                    expanded={expandedWeek === week.week}
                    onChange={handleWeekAccordionChange(week.week)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ width: '15%', flexShrink: 0 }}>
                          Week {week.week}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ width: '30%' }}>
                          {week.start_date} to {week.end_date}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {week.focus_areas.map((area, index) => (
                            <Chip key={index} label={area} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Key Tasks:
                          </Typography>
                          <List dense>
                            {week.key_tasks.map((task, index) => (
                              <ListItem key={index}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  <Assignment color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={task} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Recommended Features:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {week.recommended_features.map((feature, index) => (
                              <Chip key={index} label={feature} size="small" color="primary" variant="outlined" />
                            ))}
                          </Box>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Success Metrics:
                          </Typography>
                          {week.success_metrics && Object.entries(week.success_metrics).map(([metric, value], index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" gutterBottom>
                                {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </Typography>
                              {typeof value === 'string' && value.includes('%') ? (
                                <ProgressBarWithLabel 
                                  value={parseInt(value)} 
                                  label={value} 
                                />
                              ) : (
                                <Typography variant="body2" color="primary">
                                  {value}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>

              {/* KPIs and Keywords */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Key Performance Indicators
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell align="right">Current</TableCell>
                            <TableCell align="right">Target</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Traffic</TableCell>
                            <TableCell align="right">{kpis.traffic?.current || 0}</TableCell>
                            <TableCell align="right">{kpis.traffic?.target || 0}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Top 10 Keywords</TableCell>
                            <TableCell align="right">-</TableCell>
                            <TableCell align="right">{kpis.keyword_rankings?.top_10_target || 0}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Top 3 Keywords</TableCell>
                            <TableCell align="right">-</TableCell>
                            <TableCell align="right">{kpis.keyword_rankings?.top_3_target || 0}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Conversion Rate</TableCell>
                            <TableCell align="right">{kpis.conversion_rate?.current || 0}%</TableCell>
                            <TableCell align="right">{kpis.conversion_rate?.target || 0}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Industry Keywords
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Keyword</TableCell>
                            <TableCell align="right">Volume</TableCell>
                            <TableCell align="right">Difficulty</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {industry_keywords.map((keyword, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">{keyword.keyword}</TableCell>
                              <TableCell align="right">{keyword.volume?.toLocaleString() || 0}</TableCell>
                              <TableCell align="right">{keyword.difficulty || 0}/100</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            /* Task Management Tab */
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Task Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage your SEO tasks week by week
              </Typography>

              {Object.entries(tasksByWeek).map(([weekNumber, weekTasks]) => (
                <Accordion key={weekNumber} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Week {weekNumber}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {weekTasks.map((task) => (
                        <ListItem key={task.id} divider>
                          <ListItemIcon>
                            <Assignment color={
                              task.status === 'completed' ? 'success' : 
                              task.priority === 'high' ? 'error' : 'primary'
                            } />
                          </ListItemIcon>
                          <ListItemText
                            primary={task.task_description}
                            secondary={
                              `Priority: ${task.priority} | Status: ${task.status} | Due: ${task.due_date} | Category: ${task.category}`
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default SEOPlanDisplay;