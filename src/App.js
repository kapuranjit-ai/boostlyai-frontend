import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import {
    Box,
    Dialog  
} from '@mui/material';
// Landing Page Components
import Header from './components/LandingPage/Header';
import Home from './components/LandingPage/Home';
import Features from './components/LandingPage/Features';
import CTA from './components/LandingPage/CTA';
import Pricing from './components/LandingPage/Pricing'
import AboutUs from './components/LandingPage/AboutUs';
import Footer from './components/LandingPage/Footer';


// SEO Components
import SEOAnalyzer from './components/SEO/SEOAnalyzer';
import KeywordResearch from './components/SEO/KeywordResearch';
import MetaTagGenerator from './components/SEO/MetaTagGenerator';
import Reports from './components/SEO/Reports';

// Social Components
import ContentSuggestions from './components/Social/ContentSuggestions';
import SocialPublisher from './components/Social/SocialPublisher';
import SocialAnalytics from './components/Social/Analytics';
import ContentGenerator from './components/Social/ContentGenerator';
import AdCopyGenerator from './components/Social/AdCopyGenerator';
import CompleteVideoContent from './components/Social/CompleteVideoContent';
import VideoSnippetGenerator from './components/Social/VideoSnippetGenerator';
import VideoContentSuggestions from './components/Social/VideoContentSuggestions';
import VideoGenerator from './components/Social/VideoGenerator';
import AnalysisForm from './components/ContentExpansion/AnalysisForm';
import ResultsDisplay from './components/ContentExpansion/ResultsDisplay';
import BacklinkAnalysis from './components/backlinkAnalysis/AnalysisForm';
import AnalysisHistory from './components/backlinkAnalysis/AnalysisHistory';
import BacklinkProgram from './components/BacklinkProgram/BacklinkProgram';

// Content & Social Boost
import ContentCalendar from './components/ContentSocialBoost/ContentCalendar';
import HashtagGenerator from './components/ContentSocialBoost/HashtagGenerator';
import ImageSuggestions from './components/ContentSocialBoost/ImageSuggestions';
import VoiceToBlog from './components/ContentSocialBoost/VoiceToBlog';

// Smart Sales Enablers
import SEOChatbotWidget from './components/SEOChatbot/SEOChatbotWidget';
import AdCampaignGenerator from './components/SEOChatbot/AdCampaignGenerator';
import AdCampaignManager from './components/SEOChatbot/AdCampaignManager'; 
import SocialMediaManager from './components/SEOChatbot/SocialMediaManager'; 

// Analytics & Conversion
import PerformanceDashboard from './components/AnalyticsAndConversion/PerformanceDashboard';
import LandingPageBuilder from './components/AnalyticsAndConversion/LandingPageBuilder';

// SEO Plan Generator & Conversion
import SEOPlanDashboard from './components/Generator/SeoPlannerDashboard';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectDashboard from './pages/ProjectDashboard';
import AdminProjectMapping from './pages/AdminProjectMapping';

// Define your theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#756099',
      light: '#756099',
      dark: '#7a22c9',
    },
    secondary: {
      main: '#32CD32',
      light: '#47d147',
      dark: '#2bb82b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Landing Page Wrapper Component
function LandingPageWrapper() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogType, setAuthDialogType] = useState('login');
  const { isAuthenticated } = useApp();

  const handleAuthClick = (type = 'login') => {
    setAuthDialogType(type);
    setAuthDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAuthDialogOpen(false);
  };

  const handleSwitchAuthType = (type) => {
    setAuthDialogType(type);
  };
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }


    return (
     <div className="landing-page-app">
      <Header 
        onLoginClick={() => handleAuthClick('login')} 
        onSignupClick={() => handleAuthClick('register')} 
      />
      
      {/* These sections will scroll on the same page */}
      <section id="home">
        <Home onSignupClick={() => handleAuthClick('register')} />
      </section>
      
      <section id="features">
        <Features />
      </section>
      
      <section id="pricing">
        <Pricing />
      </section>
      
      <section id="contact">
        <CTA onSignupClick={() => handleAuthClick('register')} />
      </section>
      <Footer />
      
      {/* Auth Dialog */}
      <Dialog
        open={authDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.95) 100%)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              cursor: 'pointer',
              zIndex: 1,
              '&:hover': { color: 'primary.main' }
            }}
            onClick={handleCloseDialog}
          >
            ✕
          </Box>
          
          {authDialogType === 'login' ? (
            <Login 
              isPopup={true} 
              onClose={handleCloseDialog}
              onSwitchToRegister={() => handleSwitchAuthType('register')}
            />
          ) : (
            <Register 
              isPopup={true} 
              onClose={handleCloseDialog}
              onSwitchToLogin={() => handleSwitchAuthType('login')}
            />
          )}
        </Box>
      </Dialog>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <NotificationContainer />
          <Routes>
           
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/home" element={<LandingPageWrapper />} />
            <Route path="/features" element={<LandingPageWrapper />} />
            <Route path="/pricing" element={<LandingPageWrapper />} />
            <Route path="/about" element={<AboutUs />} /> {/* This should be separate */}
            <Route path="/contact" element={<LandingPageWrapper />} />
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />

            {/* Protected routes (with layout) */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* SEO Routes */}
                    <Route path="/seo/analyzer" element={<SEOAnalyzer />} />
                    <Route path="/seo/keywords" element={<KeywordResearch />} />
                    <Route path="/seo/meta-tags" element={<MetaTagGenerator />} />
                    <Route path="/seo/reports" element={<Reports />} />
                    
                    {/* Social Routes */}
                    <Route path="/social/content" element={<ContentSuggestions />} />
                    <Route path="/social/content-generator" element={<ContentGenerator />} />
                    <Route path="/social/publisher" element={<SocialPublisher />} />
                    <Route path="/social/analytics" element={<SocialAnalytics />} />

                    <Route path="/social/AdCopy" element={<AdCopyGenerator />} />
                    <Route path="/social/VideoContent" element={<CompleteVideoContent />} />
                    <Route path="/social/VideoSnippet" element={<VideoSnippetGenerator />} />
                    <Route path="/social/VideoContentSuggestions" element={<VideoContentSuggestions />} />
                    <Route path="/social/VideoGenerator" element={<VideoGenerator />} />

                   {/*SEO & Content Expansion*/} 
                       <Route path="/ContentExpansion/Analysis" element={<AnalysisForm />} />  
                       <Route path="/ContentExpansion/ResultDisplay" element={<ResultsDisplay />} />  
                       <Route path="/backlinkAnalysis/Backlink" element={<BacklinkAnalysis />} />  
                       <Route path="/backlinkAnalysis/BackLinkHistory" element={<AnalysisHistory />} />  
                       <Route path="/BacklinkProgram/BacklinkProgram" element={<BacklinkProgram />} />  
                  
                  {/*Content & Social Boostn*/}
                    <Route path="/ContentSocialBoost/ContentCalender" element={<ContentCalendar />} />  
                    <Route path="/ContentSocialBoost/HashtagGenerator" element={<HashtagGenerator />} />  
                    <Route path="/ContentSocialBoost/ImageSuggestions" element={<ImageSuggestions />} />  
                    <Route path="/ContentSocialBoost/VoiceToBlog" element={<VoiceToBlog />} />  
                
                 {/*Smart Sales Enablers*/} 
                    <Route path="/SEOChatbot/SEOChatbotWidget" element={<SEOChatbotWidget />} /> 
                    <Route path="/SEOChatbot/AdCampaignGenerator" element={<AdCampaignGenerator />} /> 
                    <Route path="/SEOChatbot/AdCampaignManager" element={<AdCampaignManager />} />   
                    <Route path="/SEOChatbot/SocialMediaManager" element={<SocialMediaManager />} />   
                    
                  
                   {/*Analytics & Conversion*/}
                    <Route path="/AnalyticsAndConversion/PerformanceDashboard" element={<PerformanceDashboard />} />  
                    <Route path="/AnalyticsAndConversion/LandingPageBuilder" element={<LandingPageBuilder />} />  
                  {/*SEO Plan Generator*/}
                    <Route path="/Generator/Dashboard" element={<SEOPlanDashboard />} />  

                    {/* Settings Routes */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project-dashboard" element={<ProjectDashboard />} />
                    <Route path="/project-Mapping" element={<AdminProjectMapping />} />
                    
                    
                    {/* Catch all route for protected pages */}
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Redirect from old dashboard path to new app path */}
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            
            {/* Catch all route for public pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { AppProvider } from './contexts/AppContext';
// import Layout from './components/Layout/Layout';

// // SEO Components
// import SEOAnalyzer from './components/SEO/SEOAnalyzer';
// import KeywordResearch from './components/SEO/KeywordResearch';
// import MetaTagGenerator from './components/SEO/MetaTagGenerator';
// import Reports from './components/SEO/Reports';
// // Social Components
// import ContentSuggestions from './components/Social/ContentSuggestions';
// import SocialPublisher from './components/Social/SocialPublisher';
// import SocialAnalytics from './components/Social/Analytics';
// import ContentGenerator from './components/Social/ContentGenerator';
// // Pages
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Projects from './pages/Projects';
// import ProjectDashboard from './pages/ProjectDashboard';

// // Define your theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2', // Blue
//       light: '#42a5f5',
//       dark: '#1565c0',
//     },
//     secondary: {
//       main: '#dc004e', // Pink/Red
//       light: '#ff5c8d',
//       dark: '#9a0036',
//     },
//     background: {
//       default: '#f5f5f5',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#333333',
//       secondary: '#666666',
//     },
//   },
//   typography: {
//     fontFamily: [
//       'Roboto',
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       '"Helvetica Neue"',
//       'Arial',
//       'sans-serif',
//     ].join(','),
//     h1: {
//       fontSize: '2.5rem',
//       fontWeight: 600,
//     },
//     h2: {
//       fontSize: '2rem',
//       fontWeight: 600,
//     },
//     h3: {
//       fontSize: '1.75rem',
//       fontWeight: 500,
//     },
//   },
//   spacing: 8, // This sets the base spacing unit (8px)
//   shape: {
//     borderRadius: 8, // Default border radius
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none', // Disable uppercase transformation
//           borderRadius: 8,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//         },
//       },
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AppProvider>
//         <Router>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="*" element={
//               <Layout>
//                 <Routes>
//                   <Route path="/" element={<Dashboard />} />
//                   <Route path="/seo/analyzer" element={<SEOAnalyzer />} />
//                   <Route path="/seo/keywords" element={<KeywordResearch />} />
//                   <Route path="/seo/meta-tags" element={<MetaTagGenerator />} />
//                   <Route path="/seo/reports" element={<Reports />} />
//                   <Route path="/social/content" element={<ContentSuggestions />} />
//                   <Route path="/social/publisher" element={<SocialPublisher />} />
//                   <Route path="/social/analytics" element={<SocialAnalytics />} />
//                   <Route path="/social/ContentGenerator" element={<ContentGenerator />} />
//                   <Route path="/settings/projects" element={<Projects />} />
//                   <Route path="/settings/dashboard" element={<ProjectDashboard />} />
//                 </Routes>
//               </Layout>
//             } />
//           </Routes>
//         </Router>
//       </AppProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

