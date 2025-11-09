// src/components/IndustriesBrowser.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { industriesApi } from '../../services/api';

const IndustriesBrowser = () => {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const response = await industriesApi.getIndustries();
      setIndustries(response.data.industries);
    } catch (error) {
      setError('Failed to fetch industries');
    }
  };

  const handleIndustrySelect = async (industry) => {
    setLoading(true);
    setSelectedIndustry(industry);
    setError('');

    try {
      const [keywordsRes, contentRes] = await Promise.all([
        industriesApi.getIndustryKeywords(industry.name),
        industriesApi.getIndustryContentTypes(industry.name)
      ]);

      setKeywords(keywordsRes.data.keywords || []);
      setContentTypes(contentRes.data.content_types || []);
    } catch (error) {
      setError('Failed to fetch industry details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Industries Browser
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore industry-specific SEO insights and recommendations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Industries
            </Typography>
            <List>
              {industries.map((industry) => (
                <ListItem
                  key={industry.id}
                  button
                  selected={selectedIndustry?.id === industry.id}
                  onClick={() => handleIndustrySelect(industry)}
                >
                  <ListItemText primary={industry.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : selectedIndustry ? (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedIndustry.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedIndustry.description}
                </Typography>
              </Paper>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top Keywords
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {keywords.slice(0, 10).map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Content Types
                      </Typography>
                      <List dense>
                        {contentTypes.map((type, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={type} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select an industry to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndustriesBrowser;