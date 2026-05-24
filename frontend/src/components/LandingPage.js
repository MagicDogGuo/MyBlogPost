import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid, Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Image Generation
import ArticleIcon from '@mui/icons-material/Article'; // My Posts, Content Creation
import FavoriteIcon from '@mui/icons-material/Favorite'; // Favorites
import DevicesIcon from '@mui/icons-material/Devices'; // Responsive Design
import ForumIcon from '@mui/icons-material/Forum'; // Comments
import EmailIcon from '@mui/icons-material/Email'; // Newsletter
import CreateIcon from '@mui/icons-material/Create'; // Create Post
import { useAuth } from '../context/AuthContext'; // Import useAuth

import './LandingPage.css';

const FeatureCard = ({ icon, title, description }) => (
  <Paper className="feature-card-item" elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
    <Box sx={{ fontSize: 40, mb: 2, color: 'primary.main' }}>
      {icon}
    </Box>
    <Typography variant="h5" component="h3" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const LandingPage = () => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <Box className="hero-section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: { xs: '70vh', md: '80vh' },
            textAlign: 'center',
            color: 'white'
          }}>
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '3rem', sm: '4rem', md: '5rem' } }}>
              Welcome to Wordwalker
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
              Craft, Share, and Discover. Your Words, Your World.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button 
                component={Link} 
                to="/posts" 
                variant="contained" 
                size="large"
                color="primary"
                sx={{ px: 4, py: 1.5 }}
              >
                Explore Posts
              </Button>
              <Button 
                component={Link} 
                to={user ? "/posts" : "/register"} // Conditional navigation
                variant="outlined" 
                size="large"
                sx={{ 
                  px: 4, py: 1.5, 
                  color: 'white', 
                  borderColor: 'white', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                Start Your Journey
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          Why Wordwalker?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<AutoAwesomeIcon fontSize="inherit" />}
              title="AI-Powered Imagery"
              description="Let AI generate stunning featured images for your posts based on their titles, automatically uploaded to Imgur for easy sharing."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<ArticleIcon fontSize="inherit" />}
              title="Your Content, Your Control"
              description="Manage all your articles effortlessly on your personal 'My Posts' page. Create, edit, and delete with ease."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<CreateIcon fontSize="inherit" />}
              title="Effortless Creation"
              description="A streamlined post creation form makes it simple to share your thoughts, stories, and expertise with the world."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<FavoriteIcon fontSize="inherit" />}
              title="Curate Your Favorites"
              description="Bookmark articles you love and revisit them anytime from your personalized favorites list."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<ForumIcon fontSize="inherit" />}
              title="Engage & Discuss"
              description="Dive into discussions with a built-in commenting system on every post. (Coming Soon: Enhanced Interaction!)"
            />
          </Grid>
           <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<DevicesIcon fontSize="inherit" />}
              title="Read Anywhere"
              description="Enjoy a seamless reading experience across all your devices, thanks to our responsive design."
            />
          </Grid>
        </Grid>
      </Container>

      {/* Discover & Engage Section */}
      <Box sx={{ backgroundColor: 'alternateBackground', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
            Discover, Connect, Grow
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h3" gutterBottom>
                Explore a Universe of Stories
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Dive into a diverse collection of articles from various authors. Wordwalker is a place to broaden your horizons and find inspiration.
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
                Stay Updated
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Subscribe to our newsletter to get the latest posts and updates directly in your inbox. Never miss out on new content!
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              {/* You can add an illustrative image or icon here */}
              <EmailIcon sx={{ fontSize: 120, color: 'primary.main', opacity: 0.7 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Final Call to Action Section */}
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1, fontWeight: 'medium' }}>
          Ready to Share Your Voice?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join the Wordwalker community today. It's free to sign up and start publishing your articles.
        </Typography>
        <Button 
          component={Link} 
          to="/register" 
          variant="contained" 
          size="large" 
          color="primary"
          sx={{ px: 5, py: 1.5 }}
        >
          Create Your Account
        </Button>
      </Container>
    </div>
  );
};

export default LandingPage;