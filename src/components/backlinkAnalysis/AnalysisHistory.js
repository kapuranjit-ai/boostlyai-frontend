// components/BacklinkAnalysis/AnalysisHistory.js
import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Search,
  Refresh,
  Visibility
} from '@mui/icons-material';
import { useBacklinkAnalysis } from '../backlinkAnalysis/useBacklinkAnalysis';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function AnalysisHistory() {
  const [projectId, setProjectId] = useState('');
  const [limit, setLimit] = useState(10);
  const { loading, error, data, getAnalysisHistory, analysisStatus, checkAnalysisStatus } = useBacklinkAnalysis();
  const [refreshInterval, setRefreshInterval] = useState(null);

  const handleGetHistory = async () => {
    await getAnalysisHistory(projectId, limit);
  };

  const startPolling = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    const interval = setInterval(() => {
      if (data && Array.isArray(data)) {
        data.forEach(item => {
          if (item.status === 'processing') {
            checkAnalysisStatus(item.id);
          }
        });
      }
    }, 10000); // Check every 10 seconds
    
    setRefreshInterval(interval);
  };

  const stopPolling = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const hasProcessing = data.some(item => item.status === 'processing');
      if (hasProcessing) {
        startPolling();
      } else {
        stopPolling();
      }
    }
    
    return () => stopPolling();
  }, [data]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analysis History
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Project ID"
              placeholder="Enter project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGetHistory}
              disabled={!projectId || loading}
              startIcon={<Search />}
              size="large"
            >
              {loading ? 'Loading...' : 'Get History'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <ErrorMessage error={error} onRetry={handleGetHistory} />
      )}

      {loading && <Loading message="Loading analysis history..." />}

      {data && Array.isArray(data) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis History ({data.length})
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {analysis.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {analysis.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={analysisStatus[analysis.id]?.status || analysis.status} 
                        size="small"
                        color={
                          (analysisStatus[analysis.id]?.status || analysis.status) === 'completed' ? 'success' :
                          (analysisStatus[analysis.id]?.status || analysis.status) === 'processing' ? 'warning' : 'default'
                        }
                      />
                      {(analysisStatus[analysis.id]?.status || analysis.status) === 'processing' && (
                        <LinearProgress sx={{ mt: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(analysis.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          // Navigate to analysis details
                          console.log('View analysis:', analysis.id);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {data && Array.isArray(data) && data.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Analysis History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No backlink analyses found for this project.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default AnalysisHistory;