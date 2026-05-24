import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon, // 用於收藏數圖標
  VpnKey as VpnKeyIcon // 只是示例，可以換成更合適的 role 圖標
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const UserProfilePage = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
    const fetchFavorites = async () => {
      if (token) {
        try {
          setLoadingFavorites(true);
          const response = await axios.get(API_ENDPOINTS.POSTS.MY_FAVORITES, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setFavoritesCount(response.data.length);
        } catch (err) {
          console.error('Failed to fetch favorites count:', err);
          // 不阻塞頁面顯示，只在控制台記錄錯誤，或顯示一個小的錯誤提示
          setError('Could not load favorites count.'); 
        } finally {
          setLoadingFavorites(false);
        }
      }
    };

    if (!authLoading && user) { // 確保 auth 已加載且用戶存在
      fetchFavorites();
    } else if (!authLoading && !user) { // 如果 auth 加載完畢但沒有用戶
      setLoadingFavorites(false); //不需要加載收藏
      setError('Please log in to view your profile.');
    }
  }, [token, user, authLoading]);

  if (authLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading user data...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'User not found. Please log in.'}</Alert>
      </Container>
    );
  }
  
  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode && user) { // 從編輯模式切換回查看模式時，重置輸入框為當前用戶名
      setNewUsername(user.username);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername.trim() === user.username) {
      setSnackbarMessage(newUsername.trim() === user.username ? 'Username is the same.' : 'Username cannot be empty.');
      setSnackbarOpen(true);
      return;
    }
    setIsUpdating(true);
    try {
      const response = await axios.put(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        { username: newUsername.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setSnackbarMessage('Username updated successfully! Page will refresh.');
      setSnackbarOpen(true);
      // 更新 AuthContext 中的 user 狀態是一個更優雅的做法
      // 但目前 AuthContext 未提供直接的更新方法，故採用頁面刷新
      setTimeout(() => {
        window.location.reload(); 
      }, 2000); // 延遲刷新讓用戶看到消息
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update username:', err);
      setSnackbarMessage(err.response?.data?.message || 'Failed to update username. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // 主體內容，即使收藏數還在加載也先顯示基本信息
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            {!editMode ? (
              <ListItemText primary="Username" secondary={user.username || 'N/A'} />
            ) : (
              <Box component="form" onSubmit={handleSubmitUsername} sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <TextField 
                  label="New Username"
                  value={newUsername}
                  onChange={handleUsernameChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={isUpdating}
                  sx={{ mr: 1 }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={isUpdating} size="small">
                  {isUpdating ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
              </Box>
            )}
            <Button onClick={handleEditToggle} disabled={isUpdating} size="small" sx={{ ml: 'auto' }}>
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={user.email || 'N/A'} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Favorites Count" 
              secondary={
                loadingFavorites ? <CircularProgress size={20} /> : (error && !favoritesCount ? 'Error loading' : favoritesCount)
              } 
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <VpnKeyIcon /> {/* 可以根據實際情況替換圖標 */}
            </ListItemIcon>
            <ListItemText primary="Role" secondary={user.role || 'N/A'} />
          </ListItem>
        </List>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UserProfilePage; 