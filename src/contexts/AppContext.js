import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, projectAPI, projectContext } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  projects: [],
  currentProject: null,
  isLoading: false,
  notifications: [],
  isAuthenticated: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload 
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        projects: [],
        currentProject: null,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'SET_LOADING', payload: true });
      authAPI.getProfile()
        .then(response => {
          dispatch({ type: 'SET_USER', payload: response.data });
          
          // Load user's projects after successful login
          return projectAPI.getProjects();
        })
        .then(projectsResponse => {
          const projects = Array.isArray(projectsResponse.data) 
            ? projectsResponse.data 
            : projectsResponse.data.projects || projectsResponse.data.items || [];
          
          dispatch({ type: 'SET_PROJECTS', payload: projects });
          
          // Initialize project context with available projects
          projectContext.setAvailableProjects(projects);
          
          // Set current project if one exists in localStorage
          const savedProjectId = localStorage.getItem('currentProjectId');
          if (savedProjectId) {
            const project = projects.find(p => p.id === savedProjectId);
            if (project) {
              dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
              projectContext.setCurrentProject(savedProjectId);
            }
          }
        })
        .catch((error) => {
          console.error('Auto-login failed:', error);
          localStorage.removeItem('token');
          projectContext.clearAll();
        })
        .finally(() => {
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    }
  }, []);

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const addNotification = (notification) => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } });
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Load user's projects
  const loadUserProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      
      const projects = Array.isArray(response.data) 
        ? response.data 
        : response.data.projects || response.data.items || [];
      
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      projectContext.setAvailableProjects(projects);
      return projects;
    } catch (error) {
      console.error('Failed to load projects:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load projects'
      });
      throw error;
    }
  };

  // Set current project
  const setCurrentProject = (project) => {
    if (project) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      projectContext.setCurrentProject(project.id);
    } else {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      projectContext.clearCurrentProject();
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    try {
      const response = await projectAPI.createProject(projectData);
      const newProject = response.data;
      
      // Add new project to local state
      dispatch({ type: 'SET_PROJECTS', payload: [...state.projects, newProject] });
      
      // Update project context
      projectContext.setAvailableProjects([...state.projects, newProject]);
      
      addNotification({
        type: 'success',
        message: 'Project created successfully!'
      });
      
      return newProject;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to create project';
      
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        authAPI.handleLoginResponse(response);
      }
      
      if (response.data.user) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
      }
      
      addNotification({
        type: 'success',
        message: 'Registration successful! Welcome!'
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed';
      
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        authAPI.handleLoginResponse(response);
      }
      
      let userData = response.data.user;
      if (!userData) {
        // Fallback to profile fetch if user data not in login response
        const profileResponse = await authAPI.getProfile();
        userData = profileResponse.data;
      }
      
      dispatch({ type: 'SET_USER', payload: userData });
      
      // Load user's projects after successful login
      const projects = await loadUserProjects();
      
      addNotification({
        type: 'success',
        message: 'Login successful! Welcome back!'
      });
      
      return { success: true, data: response.data, user: userData, projects };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      projectContext.clearAll();
      dispatch({ type: 'LOGOUT' });
      
      addNotification({
        type: 'info',
        message: 'You have been logged out successfully.'
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUserProjects,
    setCurrentProject,
    createProject,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setProjects: (projects) => dispatch({ type: 'SET_PROJECTS', payload: projects }),
    addNotification,
    removeNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}