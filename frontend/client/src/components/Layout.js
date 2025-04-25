import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import DonateButton from './DonateButton';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Sam's Blog
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate('/posts')}>
                  Posts
                </Button>
                {user.role !== 'admin' && (  // Only show donate button for non-admin users
                  <DonateButton />
                )}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
                <DonateButton />
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: '100%', margin: 0, padding: 0 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          width: '100%',
          backgroundColor: (theme) => theme.palette.grey[200]
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1" color="text.secondary" align="center">
            © {new Date().getFullYear()} Sam's Blog. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 