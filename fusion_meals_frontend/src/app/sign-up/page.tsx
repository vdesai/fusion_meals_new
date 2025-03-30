import { SignUp } from "@clerk/nextjs";
import { Container, Box, Typography } from "@mui/material";

export default function SignUpPage() {
  return (
    <Container maxWidth="sm" sx={{ 
      py: 8, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
    }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Join Fusion Meals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create an account to save recipes, build meal plans, and personalize your cooking experience.
        </Typography>
      </Box>
      
      <Box sx={{ 
        width: '100%', 
        boxShadow: 3, 
        borderRadius: 2, 
        p: 3, 
        bgcolor: 'background.paper' 
      }}>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              footerActionLink: 'text-blue-600 hover:text-blue-700'
            }
          }} 
          redirectUrl="/"  
        />
      </Box>
    </Container>
  );
} 