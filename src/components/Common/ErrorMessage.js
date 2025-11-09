import React from 'react';
import { Alert, Box,Typography, Button } from '@mui/material';

function ErrorMessage({ error, onRetry }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" action={onRetry && <Button onClick={onRetry}>Retry</Button>}>
        {error}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;