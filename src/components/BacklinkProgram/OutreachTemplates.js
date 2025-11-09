import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { ExpandMore, Email, ContentCopy } from '@mui/icons-material';

function OutreachTemplates({ loading, industries, onGenerateTemplates }) {
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('');

  const handleGenerate = () => {
    if (industry && businessType) {
      onGenerateTemplates(industry, businessType);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Outreach Templates
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
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading || !industry || !businessType}
            startIcon={<Email />}
          >
            {loading ? 'Generating...' : 'Generate Templates'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default OutreachTemplates;