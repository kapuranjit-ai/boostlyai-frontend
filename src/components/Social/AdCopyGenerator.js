import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { videoAPI } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function AdCopyGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const { data, error, loading, callApi } = useApi();

  const generateAdCopy = async () => {
    await callApi(
      () => videoAPI.generateAdCopy(topic, platform),
      'Ad copy generated successfully!'
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ad Copy Generator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Topic"
              placeholder="Enter your topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value)}
                required
              >
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={generateAdCopy}
              disabled={!topic || loading}
              startIcon={<AutoAwesome />}
              size="large"
              fullWidth
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={generateAdCopy} />
      )}

      {loading && <Loading message="Generating ad copy..." />}

      {data && data.ad_copies && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Ad Copies ({data.count})
          </Typography>
          <Grid container spacing={3}>
            {data.ad_copies.map((copy, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {copy.headline}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {copy.description}
                    </Typography>
                    {copy.cta && (
                      <Chip label={copy.cta} color="primary" variant="outlined" />
                    )}
                    {copy.hashtags && copy.hashtags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2">Hashtags:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {copy.hashtags.map((tag, tagIndex) => (
                            <Chip key={tagIndex} label={tag} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default AdCopyGenerator;