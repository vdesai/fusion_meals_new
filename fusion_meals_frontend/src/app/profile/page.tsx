'use client';

import { useUser } from "@clerk/nextjs";
import { Container, Box, Typography, Paper, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText, Button, Tabs, Tab, CircularProgress } from "@mui/material";
import { BookOpen, UtensilsCrossed, Calendar, User, Settings } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!isLoaded) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Please sign in to view your profile
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          href="/sign-in"
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={user.imageUrl}
            alt={user.fullName || ''}
            sx={{ width: 100, height: 100, mr: 4 }}
          />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {user.fullName || user.username || 'Fusion Meals User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.primaryEmailAddress?.emailAddress}
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Settings size={16} />}
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Profile Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="Saved Recipes" icon={<BookOpen size={16} />} iconPosition="start" />
          <Tab label="My Meal Plans" icon={<Calendar size={16} />} iconPosition="start" />
          <Tab label="Restaurant Recreations" icon={<UtensilsCrossed size={16} />} iconPosition="start" />
          <Tab label="Account" icon={<User size={16} />} iconPosition="start" />
        </Tabs>

        {/* Saved Recipes Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Saved Recipes
            </Typography>
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
              <BookOpen size={48} color="#9ca3af" />
              <Typography variant="body1" sx={{ mt: 2 }}>
                You haven't saved any recipes yet.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                href="/generate-recipe"
                sx={{ mt: 2 }}
              >
                Discover Recipes
              </Button>
            </Box>
          </Box>
        )}

        {/* Meal Plans Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Meal Plans
            </Typography>
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
              <Calendar size={48} color="#9ca3af" />
              <Typography variant="body1" sx={{ mt: 2 }}>
                You haven't created any meal plans yet.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                href="/meal-plan"
                sx={{ mt: 2 }}
              >
                Create Meal Plan
              </Button>
            </Box>
          </Box>
        )}

        {/* Restaurant Recreations Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Restaurant Recreations
            </Typography>
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
              <UtensilsCrossed size={48} color="#9ca3af" />
              <Typography variant="body1" sx={{ mt: 2 }}>
                You haven't saved any restaurant recreations yet.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                href="/restaurant-recreator"
                sx={{ mt: 2 }}
              >
                Recreate Restaurant Dishes
              </Button>
            </Box>
          </Box>
        )}

        {/* Account Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <User size={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Account Management" 
                  secondary="Update your account details, email, and password" 
                />
                <Button variant="outlined" size="small" onClick={() => user.update()}>
                  Manage
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Settings size={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Preferences" 
                  secondary="Manage your dietary preferences and restrictions" 
                />
                <Button variant="outlined" size="small" component={Link} href="/user-settings">
                  Settings
                </Button>
              </ListItem>
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 