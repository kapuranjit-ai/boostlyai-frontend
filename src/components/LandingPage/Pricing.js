import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
  Divider
} from '@mui/material';
import { Check, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(false);
  const navigate = useNavigate();

  const handleStartTrial = (plan) => {
    // Check if user is logged in (simple check)
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, start trial for selected plan
      navigate('/start-trial', { state: { plan } });
    } else {
      // User not logged in, redirect to registration
      navigate('/register', { state: { plan } });
    }
  };

  const handleContactSales = () => {
    // Implement contact sales logic
    console.log('Contact sales clicked');
    // You can redirect to a contact page or open a modal
  };

  const plans = [
    {
      name: 'Starter',
      description: 'Best for freelancers & solo creators',
      monthlyPrice: '₹1,499',
      annualPrice: '₹15,290',
      features: [
        'AI SEO Analyzer (Basic)',
        'Keyword Research (50 queries/month)',
        'AI Meta Tag Generator',
        'Social Scheduler (2 platforms)',
        'Content Generator (5 articles/mo)'
      ],
      popular: false,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Growth',
      description: 'Best for small businesses & startups',
      monthlyPrice: '₹4,999',
      annualPrice: '₹50,990',
      features: [
        'Everything in Starter',
        'Unlimited Keyword Research',
        'Advanced AI SEO Analysis',
        'Competitor Analysis (up to 5)',
        'Content Generator (20 articles/mo)'
      ],
      popular: false,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Pro',
      description: 'Best for agencies & growing companies',
      monthlyPrice: '₹9,999',
      annualPrice: '₹101,990',
      features: [
        'Everything in Growth',
        'Unlimited Competitor Analysis',
        'Unlimited AI Content Generator',
        'Ad Copy & Video Snippets',
        'Landing Page Builder & Campaign Manager'
      ],
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large teams',
      monthlyPrice: 'On Request',
      annualPrice: 'On Request',
      features: [
        'White-label & API access',
        'Dedicated account manager',
        'Custom integrations & training',
        'Priority support'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const addons = [
    { name: 'Extra Users', price: '₹500/month per user' },
    { name: 'Additional Platforms', price: '₹750/month each' },
    { name: 'One-time Comprehensive SEO Audit', price: '₹4,999' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Boostly AI Pricing
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Smarter SEO. Stronger Social. Powered by AI.
        </Typography>

        {/* Billing Toggle */}
        <Paper
          elevation={1}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 8,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body1" sx={{ px: 2 }}>
            Monthly
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={annualBilling}
                onChange={(e) => setAnnualBilling(e.target.checked)}
                color="primary"
              />
            }
            label=""
          />
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <Typography variant="body1">Annually</Typography>
            <Chip
              label="15% off"
              color="success"
              size="small"
              sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Pricing Cards */}
      <Grid container spacing={3} alignItems="stretch">
        {plans.map((plan, index) => (
          <Grid item xs={12} md={6} lg={3} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                },
                ...(plan.popular && {
                  border: '2px solid',
                  borderColor: 'primary.main',
                  transform: { md: 'scale(1.05)' },
                  '&:hover': {
                    transform: { md: 'scale(1.05) translateY(-4px)' }
                  }
                })
              }}
            >
              {plan.popular && (
                <Chip
                  icon={<Star />}
                  label="Popular"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 'bold'
                  }}
                />
              )}

              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Plan Header */}
                <Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plan.description}
                  </Typography>
                </Box>

                {/* Price */}
                <Box mt={2} mb={3}>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    color={plan.popular ? 'primary.main' : 'text.primary'}
                  >
                    {annualBilling ? plan.annualPrice : plan.monthlyPrice}
                    {plan.monthlyPrice !== 'On Request' && (
                      <Typography
                        variant="body1"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        /{annualBilling ? 'yr' : 'mo'}
                      </Typography>
                    )}
                  </Typography>
                </Box>

                {/* Features */}
                <List dense sx={{ mb: 2, flexGrow: 1 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Check
                          fontSize="small"
                          color={plan.popular ? 'primary' : 'success'}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  size="large"
                  onClick={() => 
                    plan.name === 'Enterprise' 
                      ? handleContactSales() 
                      : handleStartTrial(plan.name)
                  }
                  sx={{ mt: 2 }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add-ons Section */}
      <Paper elevation={2} sx={{ p: 4, mt: 6, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Add-ons & Notes
        </Typography>
        <Grid container spacing={2} mt={1}>
          {addons.map((addon, index) => (
            <Grid item xs={12} md={4} key={addon.name}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">{addon.name}:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {addon.price}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Annual billing gives <strong>15% off</strong> (prices update when you toggle above)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All plans include a <strong>7-day free trial</strong>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Pricing;