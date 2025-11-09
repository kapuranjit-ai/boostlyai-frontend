// src/components/Project.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { projectAPI } from '../services/api';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    target_audience: ''
  });
  const [memberFormData, setMemberFormData] = useState({
    user_email: '',
    role: 'member',
    location: ''
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.getProjects();
      
      // Handle the response structure from router
      let projectsData = [];
      
      if (response.data && Array.isArray(response.data.projects)) {
        projectsData = response.data.projects;
      } else {
        projectsData = [];
      }
      
      console.log('Projects data:', projectsData);
      setProjects(projectsData);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to fetch projects. Please try again.';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async (projectId) => {
    try {
      setMembersLoading(true);
      const response = await projectAPI.getProjectMembers(projectId);
      
      if (response.data && Array.isArray(response.data.members)) {
        setMembers(response.data.members);
        
        // Find current user's role in this project
        const currentUserMember = response.data.members.find(
          member => member.user_id === getCurrentUserId() // You'll need to implement this
        );
        setCurrentUserRole(currentUserMember?.role || null);
      } else {
        setMembers([]);
        setCurrentUserRole(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          'Failed to fetch project members.';
      setError(errorMessage);
      console.error('Error fetching project members:', err);
      setMembers([]);
      setCurrentUserRole(null);
    } finally {
      setMembersLoading(false);
    }
  };

  // Helper function to get current user ID (you might need to adjust this based on your auth)
  const getCurrentUserId = () => {
    // This should come from your auth context or localStorage
    return parseInt(localStorage.getItem('userId') || '0');
  };

  const canEditProject = (project) => {
    // Only project owner can edit the project
    return project.owner_id === getCurrentUserId();
  };

  const canDeleteProject = (project) => {
    // Only project owner can delete the project
    return project.owner_id === getCurrentUserId();
  };

  const canManageMembers = (project) => {
    // Owners and admins can manage members (based on router logic)
    return ['owner', 'admin'].includes(project.my_role);
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      if (!canEditProject(project)) {
        setError('You do not have permission to edit this project');
        return;
      }
      setEditingProject(project);
      setFormData({
        name: project.name || '',
        domain: project.domain || '',
        industry: project.industry || '',
        target_audience: project.target_audience || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        domain: '',
        industry: '',
        target_audience: ''
      });
    }
    setDialogOpen(true);
  };

  const handleOpenMemberDialog = async (project) => {
    if (!canManageMembers(project)) {
      setError('You do not have permission to manage members for this project');
      return;
    }
    
    setSelectedProject(project);
    setMemberFormData({
      user_email: '',
      role: 'member',
      location: ''
    });
    await fetchProjectMembers(project.id);
    setMemberDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      domain: '',
      industry: '',
      target_audience: ''
    });
  };

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false);
    setSelectedProject(null);
    setMembers([]);
    setCurrentUserRole(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setMemberFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingProject) {
        // Update existing project - only send changed fields
        const updateData = {};
        if (formData.name !== editingProject.name) updateData.name = formData.name;
        if (formData.domain !== editingProject.domain) updateData.domain = formData.domain;
        if (formData.industry !== editingProject.industry) updateData.industry = formData.industry;
        if (formData.target_audience !== editingProject.target_audience) updateData.target_audience = formData.target_audience;
        
        await projectAPI.updateProject(editingProject.id, updateData);
        setSuccess('Project updated successfully!');
      } else {
        // Create new project - send all required fields
        await projectAPI.createProject(formData);
        setSuccess('Project created successfully!');
      }
      
      handleCloseDialog();
      fetchProjects();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to save project. Please try again.';
      setError(errorMessage);
      console.error('Error saving project:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await projectAPI.addProjectMember(selectedProject.id, memberFormData);
      setSuccess('Member added successfully!');
      setMemberFormData({
        user_email: '',
        role: 'member',
        location: ''
      });
      await fetchProjectMembers(selectedProject.id); // Refresh members list
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to add member. Please try again.';
      setError(errorMessage);
      console.error('Error adding member:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (!canDeleteProject(project)) {
      setError('You do not have permission to delete this project');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      await projectAPI.deleteProject(projectId);
      setSuccess('Project deleted successfully!');
      fetchProjects();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to delete project. Please try again.';
      setError(errorMessage);
      console.error('Error deleting project:', err);
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
      member: 'default'
    };
    return colors[role] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading projects...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Box>
          <Tooltip title="Refresh projects">
            <IconButton onClick={fetchProjects} color="primary" sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Project
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

      {/* Projects Grid */}
      {!Array.isArray(projects) ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Data Format Error
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Projects data is not in expected format. Please check console for details.
            </Typography>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No projects found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Get started by creating your first project
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ flex: 1 }}>
                      {project.name}
                    </Typography>
                    {project.my_role && (
                      <Chip
                        label={project.my_role}
                        size="small"
                        color={getRoleColor(project.my_role)}
                        variant="outlined"
                        icon={project.my_role === 'admin' ? <AdminIcon /> : undefined}
                      />
                    )}
                  </Box>
                  
                  {project.industry && (
                    <Chip
                      label={project.industry}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}
                  
                  {project.domain && (
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 1 }}>
                      <strong>Domain:</strong> {project.domain}
                    </Typography>
                  )}
                  
                  {project.target_audience && (
                    <Typography variant="body2" color="textSecondary" paragraph>
                      <strong>Target Audience:</strong> {project.target_audience}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="textSecondary">
                    Project ID: {project.id} • Owner ID: {project.owner_id}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Tooltip title={canEditProject(project) ? "Edit project" : "Only project owner can edit"}>
                    <span>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(project)}
                        disabled={!canEditProject(project)}
                      >
                        Edit
                      </Button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={canManageMembers(project) ? "Manage members" : "Only owners and admins can manage members"}>
                    <span>
                      <Button
                        size="small"
                        startIcon={<PeopleIcon />}
                        onClick={() => handleOpenMemberDialog(project)}
                        disabled={!canManageMembers(project)}
                      >
                        Members
                      </Button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={canDeleteProject(project) ? "Delete project" : "Only project owner can delete"}>
                    <span>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={!canDeleteProject(project)}
                      >
                        Delete
                      </Button>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Project Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Project Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="domain"
              label="Domain"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.domain}
              onChange={handleInputChange}
              required
              placeholder="example.com"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="industry"
              label="Industry"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.industry}
              onChange={handleInputChange}
              required
              placeholder="e.g., E-commerce, Healthcare, Education"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="target_audience"
              label="Target Audience"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={formData.target_audience}
              onChange={handleInputChange}
              required
              placeholder="Describe your target audience..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog open={memberDialogOpen} onClose={handleCloseMemberDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Manage Members - {selectedProject?.name}
        </DialogTitle>
        <DialogContent>
          {/* Add Member Form */}
          <Box component="form" onSubmit={handleAddMember} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Add Member
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  name="user_email"
                  label="User Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={memberFormData.user_email}
                  onChange={handleMemberInputChange}
                  required
                  placeholder="user@example.com"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={memberFormData.role}
                    label="Role"
                    onChange={handleMemberInputChange}
                    required
                  >
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    {/* Note: 'owner' role should only be assigned carefully */}
                    <MenuItem value="owner">Owner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={memberFormData.location}
                  onChange={handleMemberInputChange}
                  placeholder="e.g., US, EU"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button type="submit" variant="contained" fullWidth>
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Members List */}
          <Typography variant="h6" gutterBottom>
            Project Members ({members.length})
          </Typography>
          {membersLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : members.length === 0 ? (
            <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
              No members found
            </Typography>
          ) : (
            <Grid container spacing={1}>
              {members.map((member) => (
                <Grid item xs={12} key={member.user_id}>
                  <Card variant="outlined">
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {member.user_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {member.user_email}
                          </Typography>
                          {member.joined_at && (
                            <Typography variant="caption" color="textSecondary" display="block">
                              Joined: {new Date(member.joined_at).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={member.role}
                            size="small"
                            color={getRoleColor(member.role)}
                            icon={member.role === 'admin' ? <AdminIcon /> : undefined}
                          />
                          {member.location && (
                            <Chip
                              label={member.location}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMemberDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Project;