import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Avatar,
  Divider
} from '@mui/material';
import {
  Rocket,
  Visibility,
  SmartToy,
  TrendingUp,
  Groups,
  Security
} from '@mui/icons-material';

// Import your existing Header and Footer components
import Header from '../../components/LandingPage/Header';
import Footer from '../../components/LandingPage/Footer';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/register');
  };

  const handleAuthClick = (type) => {
    // You can implement auth dialog logic here if needed
    if (type === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  const values = [
    {
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Innovation',
      description: 'Leveraging cutting-edge AI to simplify complex marketing tasks'
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Customer Success',
      description: 'Your growth is our success. We build tools that deliver real results'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Data-Driven Results',
      description: 'Making decisions based on actionable insights and analytics'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Accessibility',
      description: 'Democratizing advanced marketing tools for businesses of all sizes'
    }
  ];

  const features = [
    'Audit your SEO performance with AI insights',
    'Discover and rank for the right keywords',
    'Generate optimized content, ad copies, and visuals instantly',
    'Analyze competitors\' strategies and stay ahead',
    'Schedule and track social media campaigns effortlessly',
    'Build landing pages and manage performance from one dashboard'
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '50vh' }}>
      {/* Use your existing Header component */}
      <Header 
        onLoginClick={() => handleAuthClick('login')} 
        onSignupClick={() => handleAuthClick('register')} 
      />
      
      {/* Hero Section - Full Width */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #32CD32 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 9 },
          textAlign: 'center',
          width: '100%'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            About Boostly AI
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            Smarter SEO. Stronger Social. Powered by AI.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section - Full Width Image */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Transforming Digital Growth
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              At Boostly AI, we believe that digital growth should be smarter, faster, and simpler.
            </Typography>
            <Typography variant="body1" paragraph>
              That's why we built an all-in-one AI-powered SEO & SMO platform designed to help 
              businesses, startups, and agencies unlock their true online potential.
            </Typography>
            <Typography variant="body1" paragraph>
              Traditional digital marketing can be time-consuming and overwhelming. From keyword 
              research to competitor tracking, from content creation to social publishing — 
              marketers spend hours juggling tools and tasks. Boostly AI changes that.
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', py: 2 }}>
            <Box
                component="img"
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="AI Analytics"
                sx={{
                width: '100%',
                height: { xs: '20px', md: '1000px' },
                objectFit: 'cover',
                display: 'block'
                }}
            />
            </Box>
          </Grid> */}
        </Grid>
      </Container>

      {/* What We Offer Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            What We Offer
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
            By combining the power of Artificial Intelligence with practical marketing tools, 
            Boostly AI empowers you to:
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {feature}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <Rocket color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                To democratize digital marketing with AI, making advanced SEO and social media 
                tools accessible to every business, regardless of size or budget.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <Visibility color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                A world where businesses grow with confidence, powered by intelligent automation 
                that saves time, reduces cost, and delivers real results.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Our Values
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box textAlign="center" sx={{ p: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                    {value.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          Your Growth Partner
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Boostly AI isn't just a tool — it's your growth partner. Whether you're a freelancer, 
          a small business, or an enterprise, we provide the technology and insights you need to 
          supercharge your digital presence.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartTrial}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Back to Home
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
          Ready to experience the future of digital marketing? Start today with BoostlyAI.in
        </Typography>
      </Container>

      {/* Use your existing Footer component */}
      <Footer />
    </Box>
  );
};

export default AboutUs;