import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            color: 'white'
          }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Sam's Blog
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
              Sharing my thoughts, experiences, and stories
            </Typography>
            <Button 
              component={Link} 
              to="/posts" 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049',
                }
              }}
            >
              View Posts
            </Button>
          </Box>
        </Container>
      </div>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 300, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Latest Posts</Typography>
            <Typography>Stay updated with the latest blog posts</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 300, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Browse by Category</Typography>
            <Typography>Explore posts by different topics</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 300, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Engage and Share</Typography>
            <Typography>Feel free to leave comments and share your thoughts</Typography>
          </Paper>
        </Box>
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 3,
            color: 'white'
          }}>
            <Typography variant="body1">
              © 2025 Sam's Blog. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography
                    variant="body2"
                    component="a"
                    href="mailto:z0935323866@gmail.com"
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    Contact Us
                </Typography>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;