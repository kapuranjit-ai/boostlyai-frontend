import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Tabs,
  Tab
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ isPopup = false, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, isLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (isPopup && onClose) {
        onClose();
      }
      navigate(from, { replace: true });
    }
  };

  const content = (
    <>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Sign In
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Box textAlign="center">
          {isPopup ? (
            <Link 
              component="button" 
              type="button" 
              variant="body2"
              onClick={onSwitchToRegister}
            >
              Don't have an account? Sign Up
            </Link>
          ) : (
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign Up
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

export default Login;