// src/components/SEOPlanGenerator.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { seoPlanApi, industriesApi } from '../../services/api';

const SEOPlanGenerator = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    plan_type: 'comprehensive',
    timeframe: '30',
    goal_type: 'traffic',
    industry: '',
    current_traffic: '',
    target_traffic: '',
  });
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);
      const response = await industriesApi.getIndustries();
      setIndustries(response.data.industries || []);
    } catch (error) {
      setError('Failed to fetch industries');
      console.error('Error fetching industries:', error);
    } finally {
      setLoadingIndustries(false);
    }
  };

  const planTypes = [
    { value: 'beginner', label: 'Basic SEO Plan' },
    { value: 'intermediate', label: 'Intermediate Plan' },
    { value: 'advanced', label: 'Advanced Plan' },
  ];

  const timeframes = [
    { value: '3_month', label: 'THREE_MONTH' },
    { value: '6_month', label: 'SIX_MONTH' },
  ];

  const goalTypes = [
    { value: 'traffic', label: 'Increase Traffic' },
    { value: 'ranking', label: 'Improve Rankings' },
    { value: 'conversion', label: 'Boost Conversions' },
  ];

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleGeneratePlan = async () => {
    if (!formData.industry) {
      setError('Please select an industry');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await seoPlanApi.generatePlan(formData);
      //alert(JSON.stringify(response.data))
      setGeneratedPlan(response.data.plan_id);
      alert(response.data.plan_id)
      // onPlanGenerated(response.data.plan_name); // Fixed: use response.data.plan instead of undefined 'plan'
      // alert(response.data.plan_name)
      setActiveStep(1); // Move to the next step
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      plan_type: 'comprehensive',
      timeframe: '30',
      goal_type: 'traffic',
      industry: '',
      current_traffic: '',
      target_traffic: '',
    });
    setError('');
    setGeneratedPlan(null);
    setActiveStep(0);
  };

  return (
    <Container>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step><StepLabel>Plan Details</StepLabel></Step>
        <Step><StepLabel>Generated Plan</StepLabel></Step>
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Generate SEO Plan
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create a customized SEO plan based on your industry and goals
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Plan Type"
                value={formData.plan_type}
                onChange={handleInputChange('plan_type')}
              >
                {planTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Timeframe"
                value={formData.timeframe}
                onChange={handleInputChange('timeframe')}
              >
                {timeframes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Goal Type"
                value={formData.goal_type}
                onChange={handleInputChange('goal_type')}
              >
                {goalTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Industry"
                value={formData.industry}
                onChange={handleInputChange('industry')}
                disabled={loadingIndustries}
                helperText={loadingIndustries ? "Loading industries..." : "Select your industry"}
              >
                {loadingIndustries ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading industries...
                    </Box>
                  </MenuItem>
                ) : (
                  industries.map((industry) => (
                    <MenuItem key={industry.id} value={industry.name}>
                      {industry.name}
                    </MenuItem>
                  ))
                )}
                {industries.length === 0 && !loadingIndustries && (
                  <MenuItem disabled>
                    No industries available
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Current Monthly Traffic"
                value={formData.current_traffic}
                onChange={handleInputChange('current_traffic')}
                placeholder="e.g., 1000"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Target Monthly Traffic"
                value={formData.target_traffic}
                onChange={handleInputChange('target_traffic')}
                placeholder="e.g., 5000"
                InputProps={{ inputProps: { min: 0 } }}
                error={formData.target_traffic && formData.current_traffic && 
                       parseInt(formData.target_traffic) <= parseInt(formData.current_traffic)}
                helperText={
                  formData.target_traffic && formData.current_traffic && 
                  parseInt(formData.target_traffic) <= parseInt(formData.current_traffic) 
                    ? "Target traffic should be higher than current traffic" 
                    : ""
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGeneratePlan}
              disabled={loading || !formData.industry}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Generating...' : 'Generate Plan'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={handleClearForm}
            >
              Clear Form
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && generatedPlan && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Your SEO Plan
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Here's your customized SEO plan for {formData.industry} industry
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Plan Overview
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Type:</strong> {formData.plan_type}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Timeframe:</strong> {formData.timeframe} days
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Goal:</strong> {goalTypes.find(g => g.value === formData.goal_type)?.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Traffic Goal:</strong> Increase from {formData.current_traffic} to {formData.target_traffic} monthly visitors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Plan Details
                  </Typography>
                  <Box sx={{ 
                    background: '#f5f5f5', 
                    padding: '16px', 
                    borderRadius: '4px',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(generatedPlan, null, 2)}
                    </pre>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => setActiveStep(0)}>
              Create Another Plan
            </Button>
            <Button variant="outlined">
              Download PDF
            </Button>
            <Button variant="outlined" onClick={handleClearForm}>
              Start Over
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default SEOPlanGenerator;