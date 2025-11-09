// src/components/AdminProjectMapping.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { projectAPI } from '../services/api';

const AdminProjectMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    project_id: '',
    role: 'member',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all mappings (admin can see all)
      const mappingsResponse = await projectAPI.getUserProjectMappings();
      
      // Fetch all projects for dropdown
      const projectsResponse = await projectAPI.getProjects();
      
      // Note: You'll need to create an API to get all users
      // For now, we'll extract unique users from mappings
      const uniqueUsers = extractUniqueUsers(mappingsResponse.data?.mappings || []);
      
      setMappings(mappingsResponse.data?.mappings || []);
      setProjects(projectsResponse.data?.projects || []);
      setUsers(uniqueUsers);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          'Failed to load data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractUniqueUsers = (mappings) => {
    const userMap = new Map();
    mappings.forEach(mapping => {
      if (mapping.user_id && !userMap.has(mapping.user_id)) {
        userMap.set(mapping.user_id, {
          id: mapping.user_id,
          email: mapping.user_email,
          full_name: mapping.user_name
        });
      }
    });
    return Array.from(userMap.values());
  };

  const handleOpenDialog = () => {
    setFormData({
      user_id: '',
      project_id: '',
      role: 'member',
      location: ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      user_id: '',
      project_id: '',
      role: 'member',
      location: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMapping = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      // Find user email from user_id
      const user = users.find(u => u.id === parseInt(formData.user_id));
      if (!user) {
        setError('User not found');
        return;
      }

      // Use the add project member endpoint
      await projectAPI.addProjectMember(formData.project_id, {
        user_email: user.email,
        role: formData.role,
        location: formData.location
      });

      setSuccess('User mapped to project successfully!');
      handleCloseDialog();
      fetchData(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to map user to project';
      setError(errorMessage);
      console.error('Error adding mapping:', err);
    }
  };

  const handleRemoveMapping = async (mappingId, projectId, userId) => {
    if (!window.confirm('Are you sure you want to remove this user from the project?')) {
      return;
    }

    try {
      setError(null);
      
      // Note: You'll need to create a remove member endpoint in your API
      // For now, we'll use a placeholder function
      await projectAPI.removeProjectMember(projectId, userId);
      
      setSuccess('User removed from project successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          'Failed to remove user from project';
      setError(errorMessage);
      console.error('Error removing mapping:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'primary',
      admin: 'secondary',
      member: 'default',
      guest: 'warning'
    };
    return colors[role] || 'default';
  };

  const filteredMappings = mappings.filter(mapping =>
    mapping.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading project mappings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User-Project Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            System Admin Panel - Manage user access to projects
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={fetchData} color="primary" sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Mapping
          </Button>
        </Box>
      </Box>

      {/* Error/Success Messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>

      {/* Search Box */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by user name, email, project name, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </CardContent>
      </Card>

      {/* Mappings Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Mappings ({filteredMappings.length})
          </Typography>
          
          {filteredMappings.length === 0 ? (
            <Typography color="textSecondary" textAlign="center" py={4}>
              No project mappings found
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Joined Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMappings.map((mapping) => (
                    <TableRow key={mapping.mapping_id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {mapping.user_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {mapping.user_email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {mapping.project_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {mapping.project_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mapping.role}
                          size="small"
                          color={getRoleColor(mapping.role)}
                          icon={mapping.role === 'admin' ? <AdminIcon /> : undefined}
                        />
                      </TableCell>
                      <TableCell>
                        {mapping.location ? (
                          <Chip
                            label={mapping.location}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {mapping.joined_at ? new Date(mapping.joined_at).toLocaleDateString() : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Remove user from project">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRemoveMapping(
                              mapping.mapping_id, 
                              mapping.project_id, 
                              mapping.user_id
                            )}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Mapping Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add User to Project
        </DialogTitle>
        <form onSubmit={handleAddMapping}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>User</InputLabel>
                  <Select
                    name="user_id"
                    value={formData.user_id}
                    label="User"
                    onChange={handleInputChange}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Project</InputLabel>
                  <Select
                    name="project_id"
                    value={formData.project_id}
                    label="Project"
                    onChange={handleInputChange}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name} ({project.domain})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="owner">Owner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., US, EU"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Mapping
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminProjectMapping;