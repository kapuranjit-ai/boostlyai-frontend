import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Grid
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { trialApi } from '../services/api';

const Register = ({ isPopup = false, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    userType: 'registered',
    agreeToTerms: false
  });
  const [validationError, setValidationError] = useState('');
  const { register, isLoading } = useApp();
  const navigate = useNavigate();

  // User type options
  const userTypes = [
    { value: 'registered', label: 'Registered User' },
    { value: 'admin', label: 'Administrator' },
    { value: 'moderator', label: 'Moderator' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError('All fields marked with * are required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      setValidationError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      email: formData.email,
      password: formData.password,
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      user_type: formData.userType,
      location: formData.location || null
    };

    const result = await register(userData);
    
    if (result.success) {
      // Automatically start trial after successful registration
      try {
        const response = await trialApi.startTrial();
        console.log('Trial started successfully:', response.data);
        navigate('/');
      } catch (error) {
        console.error('Failed to start trial:', error);
        // Even if trial fails, still navigate to home page since registration was successful
        navigate('/');
      }
    }
  };

  const content = (
    <>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Create Account
      </Typography>

      {validationError && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {validationError}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
        </Grid>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          helperText="Password must be at least 6 characters long"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          margin="normal"
          fullWidth
          select
          name="userType"
          label="User Type"
          id="userType"
          value={formData.userType}
          onChange={handleChange}
          disabled={isLoading}
        >
          {userTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          margin="normal"
          fullWidth
          name="location"
          label="Location (Optional)"
          id="location"
          autoComplete="country-name"
          value={formData.location}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormControlLabel
          control={
            <Checkbox 
              required
              name="agreeToTerms" 
              checked={formData.agreeToTerms}
              onChange={handleChange}
              color="primary"
            />
          }
          label="I agree to the terms and conditions"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading || !formData.agreeToTerms}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Box textAlign="center">
          {isPopup ? (
            <Link 
              component="button" 
              type="button" 
              variant="body2"
              onClick={onSwitchToLogin}
            >
              Already have an account? Sign In
            </Link>
          ) : (
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign In
            </Link>
          )}
        </Box>
      </Box>
    </>
  );

  if (isPopup) {
    return (
      <Box sx={{ p: 3 }}>
        {content}
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          {content}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;