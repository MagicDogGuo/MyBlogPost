import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  Article as ArticleIcon,
  VolunteerActivism as VolunteerActivismIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import DonateButton from './DonateButton';
import SubscribeDialog from './SubscribeDialog';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleSubscribeClick = () => {
    setSubscribeDialogOpen(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigate = () => {
    navigate('/profile');
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/logo192.png`}
              alt="Wordwalker Logo"
              style={{ height: '32px', marginRight: '8px' }}
            />
            <Typography
              variant="h6"
              component="div"
            >
              Wordwalker
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate('/posts')}>
                  Posts
                </Button>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{ ml: 1, p: 0.5 }}
                    aria-controls={menuOpen ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    color="inherit"
                  >
                    {user.username ? (
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : (
                      <AccountCircleIcon sx={{ width: 32, height: 32 }} />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={menuOpen}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose} 
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileNavigate}>
                    <Avatar sx={{ width: 28, height: 28, mr:1, fontSize: '0.875rem' }}>
                       {user.username ? user.username.charAt(0).toUpperCase() : <AccountCircleIcon fontSize="small"/>}
                    </Avatar> 
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/favorites'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <FavoriteIcon fontSize="small" />
                    </ListItemIcon>
                    My Favorites
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/my-posts'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    My Posts
                  </MenuItem>
                  {user && user.role !== 'admin' && (
                    <MenuItem onClick={handleMenuClose}>
                      <ListItemIcon>
                        <VolunteerActivismIcon fontSize="small" />
                      </ListItemIcon>
                      <DonateButton />
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                       <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </>
            )}
            <Tooltip title="Subscribe to Newsletter">
              <IconButton 
                color="inherit" 
                onClick={handleSubscribeClick}
                sx={{ 
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
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
            © {new Date().getFullYear()} Wordwalker. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Subscribe Dialog */}
      <SubscribeDialog 
        open={subscribeDialogOpen} 
        onClose={() => setSubscribeDialogOpen(false)} 
      />
    </Box>
  );
};

export default Layout; 