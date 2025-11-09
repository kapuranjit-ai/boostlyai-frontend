import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore,
  Link,
  Schedule,
  Email,
  CalendarToday,
  Analytics,
  RocketLaunch,
  Monitor,
  Business,
} from '@mui/icons-material';
import { useBacklinkProgram } from '../../hooks/useBacklinkProgram';
import BacklinkStrategyView from './BacklinkStrategyView'; // Import the view component
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`backlink-tabpanel-${index}`}
      aria-labelledby={`backlink-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function BacklinkProgram() {
  const [activeTab, setActiveTab] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [goals, setGoals] = useState([]);
  const [timeframe, setTimeframe] = useState('3 months');
  const [urgency, setUrgency] = useState('standard');
  const [showStrategyView, setShowStrategyView] = useState(false);

  const {
    loading,
    error,
    data,
    industries,
    loadIndustries,
    generateBacklinkStrategy,
    generateQuickBacklinkPlan,
    monitorBacklinkOpportunities,
    generateOutreachTemplates,
    getPostingSchedule,
    getContentCalendar,
    clearError,
    clearData,
  } = useBacklinkProgram();

  // Load industries on component mount
  useEffect(() => {
    loadIndustries();
  }, [loadIndustries]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    clearData();
    clearError();
  };

  const handleGoalToggle = (goal) => {
    setGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleGenerateStrategy = async () => {
    if (!websiteUrl || !industry || !businessType) {
      return;
    }
     try {
      await generateBacklinkStrategy(
        websiteUrl,
        industry,
        businessType,
        goals,
        timeframe
      );
       setShowStrategyView(true);
    } catch (err) {
      // Error handled by hook
    }
    };
  
    const handleBackToForm = () => {
    setShowStrategyView(false);
    clearData();
  };

  const handleQuickPlan = async () => {
    if (!industry || !businessType) {
      return;
    }
    await generateQuickBacklinkPlan(
      industry,
      businessType,
      urgency
    );
  };

  const handleMonitorOpportunities = async () => {
    if (!websiteUrl || !industry) {
      return;
    }
    await monitorBacklinkOpportunities(
      websiteUrl,
      industry
    );
  };

  const availableGoals = [
    'increase_domain_authority',
    'improve_search_rankings',
    'drive_traffic',
    'brand_awareness',
    'lead_generation',
    'competitor_replacement'
  ];

  const goalLabels = {
    increase_domain_authority: 'Increase Domain Authority',
    improve_search_rankings: 'Improve Search Rankings',
    drive_traffic: 'Drive More Traffic',
    brand_awareness: 'Build Brand Awareness',
    lead_generation: 'Generate Leads',
    competitor_replacement: 'Replace Competitor Backlinks'
  };
  
  // If we have data and should show strategy view, display it
  if (showStrategyView && data) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleBackToForm}
            sx={{ mb: 2 }}
          >
            ← Back to Strategy Generator
          </Button>
          <BacklinkStrategyView strategyData={data} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Backlink Program Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Create comprehensive backlink strategies, outreach templates, and content calendars to boost your SEO
        </Typography>

        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<RocketLaunch />} label="Comprehensive Strategy" />
            <Tab icon={<Business />} label="Quick Plan" />
            <Tab icon={<Monitor />} label="Opportunity Monitor" />
            <Tab icon={<Email />} label="Outreach Templates" />
            <Tab icon={<Schedule />} label="Posting Schedule" />
            <Tab icon={<CalendarToday />} label="Content Calendar" />
          </Tabs>

          {error && (
            <Box sx={{ p: 2 }}>
              <ErrorMessage error={error} onRetry={clearError} />
            </Box>
          )}

          {/* Comprehensive Strategy Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Strategy Configuration
                    </Typography>
                    <TextField
                      fullWidth
                      label="Website URL"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      margin="normal"
                      placeholder="https://example.com"
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={industry}
                        label="Industry"
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        {industries.map((ind) => (
                          <MenuItem key={ind} value={ind}>
                            {ind.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Business Type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      margin="normal"
                      placeholder="E-commerce, SaaS, Agency, etc."
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Timeframe</InputLabel>
                      <Select
                        value={timeframe}
                        label="Timeframe"
                        onChange={(e) => setTimeframe(e.target.value)}
                      >
                        <MenuItem value="1 month">1 Month</MenuItem>
                        <MenuItem value="3 months">3 Months</MenuItem>
                        <MenuItem value="6 months">6 Months</MenuItem>
                        <MenuItem value="1 year">1 Year</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                      Goals:
                    </Typography>
                    <FormGroup>
                      {availableGoals.map((goal) => (
                        <FormControlLabel
                          key={goal}
                          control={
                            <Checkbox
                              checked={goals.includes(goal)}
                              onChange={() => handleGoalToggle(goal)}
                            />
                          }
                          label={goalLabels[goal]}
                        />
                      ))}
                    </FormGroup>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={handleGenerateStrategy}
                      disabled={loading || !websiteUrl || !industry || !businessType}
                      startIcon={<RocketLaunch />}
                    >
                      {loading ? 'Generating...' : 'Generate Strategy'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                {loading && <Loading message="Generating comprehensive backlink strategy..." />}
                {data?.strategy && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Generated Strategy
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        For {websiteUrl} in {industry} industry
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          📊 Strategy Overview
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {data.strategy.overview}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          🎯 Key Objectives
                        </Typography>
                        <List dense>
                          {data.strategy.key_objectives?.map((objective, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>•</ListItemIcon>
                              <ListItemText primary={objective} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          🔗 Target Platforms
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {data.strategy.target_platforms?.map((platform, index) => (
                            <Chip key={index} label={platform} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          📝 Content Types
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {data.strategy.content_types?.map((type, index) => (
                            <Chip key={index} label={type} size="small" color="primary" />
                          ))}
                        </Box>
                      </Box>

                      {data.strategy.monthly_breakdown && (
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>📅 Monthly Breakdown</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {Object.entries(data.strategy.monthly_breakdown).map(([month, tasks]) => (
                              <Box key={month} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {month}:
                                </Typography>
                                <List dense>
                                  {tasks.map((task, index) => (
                                    <ListItem key={index}>
                                      <ListItemIcon>•</ListItemIcon>
                                      <ListItemText primary={task} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Quick Plan Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Plan Configuration
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={industry}
                        label="Industry"
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        {industries.map((ind) => (
                          <MenuItem key={ind} value={ind}>
                            {ind.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Business Type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      margin="normal"
                      placeholder="E-commerce, SaaS, Agency, etc."
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Urgency</InputLabel>
                      <Select
                        value={urgency}
                        label="Urgency"
                        onChange={(e) => setUrgency(e.target.value)}
                      >
                        <MenuItem value="low">Low (6+ months)</MenuItem>
                        <MenuItem value="standard">Standard (3-6 months)</MenuItem>
                        <MenuItem value="high">High (1-3 months)</MenuItem>
                        <MenuItem value="urgent">Urgent (1 month)</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={handleQuickPlan}
                      disabled={loading || !industry || !businessType}
                      startIcon={<Business />}
                    >
                      {loading ? 'Generating...' : 'Generate Quick Plan'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                {loading && <Loading message="Generating quick backlink plan..." />}
                {data?.quick_plan && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Backlink Plan
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        For {industry} - {businessType}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          🚀 Immediate Actions (First 30 days)
                        </Typography>
                        <List dense>
                          {data.quick_plan.immediate_actions?.map((action, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>•</ListItemIcon>
                              <ListItemText primary={action} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          🎯 Quick Wins
                        </Typography>
                        <List dense>
                          {data.quick_plan.quick_wins?.map((win, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>⭐</ListItemIcon>
                              <ListItemText primary={win} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          📊 Expected Results
                        </Typography>
                        <Typography variant="body2">
                          {data.quick_plan.expected_results}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Opportunity Monitor Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monitor Backlink Opportunities
                    </Typography>
                    <TextField
                      fullWidth
                      label="Website URL"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      margin="normal"
                      placeholder="https://example.com"
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={industry}
                        label="Industry"
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        {industries.map((ind) => (
                          <MenuItem key={ind} value={ind}>
                            {ind.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={handleMonitorOpportunities}
                      disabled={loading || !websiteUrl || !industry}
                      startIcon={<Monitor />}
                    >
                      {loading ? 'Monitoring...' : 'Monitor Opportunities'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                {loading && <Loading message="Monitoring backlink opportunities..." />}
                {data?.opportunities && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Backlink Opportunities
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Found {data.opportunities.opportunities?.length || 0} opportunities for {websiteUrl}
                      </Typography>

                      {data.opportunities.opportunities?.map((opportunity, index) => (
                        <Accordion key={index} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle2">
                              {opportunity.platform} - {opportunity.type}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" paragraph>
                              {opportunity.description}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                              <Chip label={`Difficulty: ${opportunity.difficulty}`} size="small" />
                              <Chip label={`Potential: ${opportunity.potential}`} size="small" color="primary" />
                            </Box>
                            <Typography variant="subtitle2">Action Steps:</Typography>
                            <List dense>
                              {opportunity.action_steps?.map((step, stepIndex) => (
                                <ListItem key={stepIndex}>
                                  <ListItemIcon>•</ListItemIcon>
                                  <ListItemText primary={step} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Additional tabs for Outreach Templates, Posting Schedule, and Content Calendar would follow similar patterns */}
        </Paper>

        {!loading && !data && activeTab === 0 && (
          <Alert severity="info">
            Configure your backlink strategy by filling out the form. We'll generate a comprehensive plan including target platforms, content types, and monthly breakdown.
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default BacklinkProgram;