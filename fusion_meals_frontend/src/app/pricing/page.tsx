"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardHeader, CardActions, Grid, Divider, List, ListItem, ListItemIcon, ListItemText, Switch, TextField, CircularProgress, Alert, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/navigation';

// Define pricing tiers
const pricingTiers = [
  {
    title: 'Free',
    price: '$0',
    description: 'Basic features for casual cooking',
    buttonText: 'Current Plan',
    buttonVariant: 'outlined',
    features: [
      { name: 'Basic Recipe Analysis', included: true },
      { name: 'Recipe Scaling', included: true },
      { name: 'Ingredient Substitution', included: true },
      { name: 'Basic Meal Planning', included: true },
      { name: 'Recipe Sharing', included: true },
      { name: 'AI Personal Chef', included: false },
      { name: 'Premium Recipe Curation', included: false },
      { name: 'Advanced Cooking Guidance', included: false },
      { name: 'Ingredient Sourcing Guide', included: false },
      { name: 'Priority Support', included: false },
    ]
  },
  {
    title: 'Premium Monthly',
    price: '$9.99',
    period: 'month',
    description: 'Everything you need for gourmet cooking',
    buttonText: 'Get Premium',
    buttonVariant: 'contained',
    features: [
      { name: 'Advanced Recipe Analysis', included: true },
      { name: 'Recipe Scaling', included: true },
      { name: 'Ingredient Substitution', included: true },
      { name: 'Advanced Meal Planning', included: true },
      { name: 'Recipe Sharing', included: true },
      { name: 'AI Personal Chef', included: true },
      { name: 'Premium Recipe Curation', included: true },
      { name: 'Advanced Cooking Guidance', included: true },
      { name: 'Ingredient Sourcing Guide', included: true },
      { name: 'Priority Support', included: true },
    ]
  },
  {
    title: 'Premium Annual',
    price: '$89.99',
    period: 'year',
    description: 'Save 25% with annual billing',
    buttonText: 'Get Premium',
    buttonVariant: 'contained',
    features: [
      { name: 'Advanced Recipe Analysis', included: true },
      { name: 'Recipe Scaling', included: true },
      { name: 'Ingredient Substitution', included: true },
      { name: 'Advanced Meal Planning', included: true },
      { name: 'Recipe Sharing', included: true },
      { name: 'AI Personal Chef', included: true },
      { name: 'Premium Recipe Curation', included: true },
      { name: 'Advanced Cooking Guidance', included: true },
      { name: 'Ingredient Sourcing Guide', included: true },
      { name: 'Priority Support', included: true },
    ]
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const router = useRouter();

  // Mock function to handle subscription
  const handleSubscribe = async (tier: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // In a real implementation, this would connect to a payment processor
      // For this demo, we'll simulate a successful subscription
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user subscription status in our backend
      const response = await fetch('/api/ai-chef/subscription/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_level: 'premium',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      
      setSuccess(true);
      
      // Redirect to AI Chef feature after a short delay
      setTimeout(() => {
        router.push('/ai-chef-premium');
      }, 2000);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const premiumFeatureHighlights = [
    {
      icon: <RestaurantIcon fontSize="large" color="primary" />,
      title: "Personalized Meal Planning",
      description: "Get custom meal plans based on your dietary preferences, household size, and budget. Includes grocery lists and meal prep guides."
    },
    {
      icon: <KitchenIcon fontSize="large" color="primary" />,
      title: "Professional Cooking Guidance",
      description: "Step-by-step professional chef techniques, common pitfalls to avoid, and plating presentations that will wow your guests."
    },
    {
      icon: <ShoppingBasketIcon fontSize="large" color="primary" />,
      title: "Ingredient Sourcing",
      description: "Learn where to find the best ingredients, how to select for quality, and tips for storing to maximize freshness."
    },
    {
      icon: <MenuBookIcon fontSize="large" color="primary" />,
      title: "Premium Recipe Curation",
      description: "Access restaurant-quality recipes with wine pairings, chef's notes, and cultural background information."
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Premium Features
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Unlock the full potential of your cooking with Fusion Meals Premium
      </Typography>
      
      {/* Premium Feature Highlights */}
      <Box sx={{ my: 5 }}>
        <Grid container spacing={4}>
          {premiumFeatureHighlights.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" component="h3" sx={{ ml: 2 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Pricing Tiers */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Choose Your Plan
        </Typography>
        <Grid container spacing={3} alignItems="stretch">
          {pricingTiers.map((tier, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: tier.title.includes('Premium') ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {tier.title.includes('Annual') && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -15, 
                      right: -15, 
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 2
                    }}
                  >
                    <LocalOfferIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="bold">BEST VALUE</Typography>
                  </Box>
                )}
                
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center', variant: 'h5' }}
                  sx={{
                    backgroundColor: tier.title.includes('Premium') ? 'primary.light' : 'grey.200',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4" color="text.primary">
                      {tier.price}
                    </Typography>
                    {tier.period && (
                      <Typography variant="h6" color="text.secondary">
                        /{tier.period}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic', mb: 3 }}>
                    {tier.description}
                  </Typography>
                  <List dense>
                    {tier.features.map((feature) => (
                      <ListItem key={feature.name} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {feature.included ? (
                            <CheckIcon color="success" />
                          ) : (
                            <CloseIcon color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature.name} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: feature.included ? 'text.primary' : 'text.secondary'
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant as 'outlined' | 'contained'}
                    color="primary"
                    onClick={() => handleSubscribe(index)}
                    disabled={loading || (tier.title === 'Free')}
                  >
                    {loading && selectedTier === index ? <CircularProgress size={24} /> : tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Subscription successful! Redirecting to AI Personal Chef...
        </Alert>
      )}
      
      {/* FAQ Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              How does the subscription work?
            </Typography>
            <Typography variant="body1" paragraph>
              Our premium subscription gives you immediate access to all premium features including the AI Personal Chef. You can cancel anytime from your account settings.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Is there a free trial?
            </Typography>
            <Typography variant="body1" paragraph>
              Yes! New users can try premium features for 7 days before deciding to subscribe.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Can I change plans later?
            </Typography>
            <Typography variant="body1" paragraph>
              Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your account settings.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              What payment methods do you accept?
            </Typography>
            <Typography variant="body1" paragraph>
              We accept all major credit cards, PayPal, and Apple Pay.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* Testimonials */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          What Our Premium Users Say
        </Typography>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} color="primary" />
                  ))}
                </Box>
                <Typography variant="body1" paragraph>
                  "The AI Personal Chef has completely transformed how I cook at home. The meal plans are perfect for my family, and the cooking guidance makes me feel like a professional!"
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  — Sarah T., Premium Member
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} color="primary" />
                  ))}
                </Box>
                <Typography variant="body1" paragraph>
                  "Worth every penny! The ingredient sourcing guide has helped me find amazing specialty ingredients I never knew existed. My dinner parties have never been more impressive."
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  — Michael D., Premium Member
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} color="primary" />
                  ))}
                </Box>
                <Typography variant="body1" paragraph>
                  "The premium recipes are restaurant-quality with detailed wine pairings. I've saved so much money by cooking gourmet meals at home instead of going out."
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  — Jennifer K., Premium Member
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* CTA */}
      <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => handleSubscribe(2)}
          sx={{ px: 4, py: 1.5 }}
        >
          Upgrade to Premium Now
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          30-day money-back guarantee. No questions asked.
        </Typography>
      </Box>
    </Container>
  );
} 