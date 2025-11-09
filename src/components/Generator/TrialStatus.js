// src/components/TrialStatus.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { trialApi } from '../../services/api';

const TrialStatus = ({ trialStatus, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      await trialApi.startTrial();
      setMessage('Trial started successfully!');
      onStatusUpdate();
    } catch (error) {
      setMessage('Failed to start trial');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToPaid = async () => {
    setLoading(true);
    try {
      await trialApi.convertToPaid();
      setMessage('Converted to paid subscription successfully!');
      onStatusUpdate();
    } catch (error) {
      setMessage('Failed to convert to paid');
    } finally {
      setLoading(false);
    }
  };

  const getProgressValue = () => {
    if (!trialStatus?.is_active) return 0;
    const totalDays = 7;
    const daysUsed = Math.min(totalDays - trialStatus.days_remaining, totalDays);
    return (daysUsed / totalDays) * 100;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Trial Management
      </Typography>

      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trial Status
              </Typography>
              
              {trialStatus?.has_trial ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={trialStatus.is_active ? 'ACTIVE' : 'EXPIRED'}
                      color={trialStatus.is_active ? 'success' : 'error'}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {trialStatus.days_remaining} days remaining
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getProgressValue()}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary="Started"
                        secondary={new Date(trialStatus.started_at).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ends"
                        secondary={new Date(trialStatus.ends_at).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No active trial. Start your 7-day free trial to access all features.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!trialStatus?.has_trial && (
                  <Button
                    variant="contained"
                    onClick={handleStartTrial}
                    disabled={loading}
                    startIcon={<TrendingUp />}
                  >
                    Start 7-Day Free Trial
                  </Button>
                )}

                {trialStatus?.is_active && (
                  <Button
                    variant="outlined"
                    onClick={handleConvertToPaid}
                    disabled={loading}
                    startIcon={<CheckCircle />}
                  >
                    Convert to Paid
                  </Button>
                )}

                <Button variant="outlined" disabled>
                  View Usage Statistics
                </Button>

                <Button variant="outlined" disabled>
                  Upgrade Plan
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trial Features
              </Typography>
              <Grid container spacing={2}>
                {[
                  'AI-Powered SEO Plans',
                  'Industry Insights',
                  'Keyword Research',
                  'Content Recommendations',
                  'Performance Analytics',
                  'Competitor Analysis'
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrialStatus;