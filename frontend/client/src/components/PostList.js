import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Card,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Avatar,
  Link,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { formatDistanceToNowStrict } from 'date-fns';

const PostListItem = ({ post, onDelete, onEdit, isAdmin, user }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.some(like => like.user === user.id || like.user?._id === user.id));
    }
    setLikeCount(post.likes?.length || 0);
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isLiking) return;

    const originalLiked = liked;
    const originalLikeCount = likeCount;

    setIsLiking(true);
    setLiked(!originalLiked);
    setLikeCount(prev => !originalLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.POSTS.LIKE(post._id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        if (response.data.likeCount !== undefined) setLikeCount(response.data.likeCount);
        if (response.data.isLiked !== undefined) setLiked(response.data.isLiked);
        else if (response.data.likes && Array.isArray(response.data.likes) && user?.id) {
            setLiked(response.data.likes.some(like => like.user === user.id || like.user?._id === user.id));
        }
      }
    } catch (error) {
      setLiked(originalLiked);
      setLikeCount(originalLikeCount);
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleDelete = () => {
    onDelete(post._id);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(post);
    handleMenuClose();
  };
  
  const formattedDate = post.createdAt ? formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true }) : 'some time ago';
  const canManagePost = isAdmin || (user && post.author?._id === user.id);

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, boxShadow: 'none', borderBottom: '1px solid #e0e0e0', borderRadius:0, pb:2 }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }} 
            src={post.author?.avatarUrl}
          >
            {post.author?.username ? post.author.username.charAt(0).toUpperCase() : 'A'}
          </Avatar>
          <Typography variant="body2" component="span">
            <Link component={RouterLink} to={`/author/${post.author?._id}`} color="text.primary" sx={{ textDecoration: 'none', fontWeight: 500}}>
              {post.author?.username || 'Anonymous'}
            </Link>
          </Typography>
        </Box>

        <Link component={RouterLink} to={`/posts/${post._id}`} sx={{ textDecoration: 'none' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#242424', mb: 0.5, lineHeight: 1.3 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: post.imageUrl ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.4
          }}>
            {post.content.substring(0, post.imageUrl ? 100 : 150)}
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
            <Tooltip title={liked ? "Unlike" : "Like"}>
              <IconButton size="small" onClick={handleLike} disabled={isLiking} sx={{ p:0.5, color: liked ? 'error.main' : 'text.secondary' }}>
                {liked ? <Icons.Favorite sx={{fontSize: '1.1rem'}} /> : <Icons.FavoriteBorder sx={{fontSize: '1.1rem'}}/>}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{cursor: 'pointer'}} onClick={() => navigate(`/posts/${post._id}#comments`)}>
              <Icons.ChatBubbleOutline sx={{fontSize: '1rem', verticalAlign: 'middle', mr: 0.5}} />
              {post.commentCount || 0}
            </Typography>
          </Box>
          
          <Box>
            {canManagePost && (
              <IconButton size="small" onClick={handleMenuOpen}><Icons.MoreHoriz sx={{fontSize: '1.2rem'}} /></IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {post.imageUrl && (
        <Box sx={{ 
          width: { xs: '100%', sm: 180 },
          height: { xs: 180, sm: 'auto'},
          maxHeight: {sm: 150},
          p: {xs: 2, sm: 0},
          pt: {sm: 2},
          pr: {sm: 2},
          pb: {sm: 2},
          alignSelf:'center' 
        }}>
          <Link component={RouterLink} to={`/posts/${post._id}`} sx={{ display: 'block', width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Link>
        </Box>
      )}
      {canManagePost && (
        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleEdit}><ListItemIcon><Icons.Edit fontSize="small" /></ListItemIcon>Edit</MenuItem>
            <MenuItem onClick={handleDelete}><ListItemIcon><Icons.Delete fontSize="small" /></ListItemIcon>Delete</MenuItem>
        </Menu>
      )}
    </Card>
  );
};

const PostList = ({ posts, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  console.log('[PostList Main] Rendering with posts:', posts);
  if (!posts || posts.length === 0) {
    return <Typography sx={{textAlign: 'center', mt: 5}}>No posts available yet.</Typography>;
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostListItem 
          key={post._id} 
          post={post} 
          onDelete={onDelete} 
          onEdit={onEdit} 
          isAdmin={isAdmin}
          user={user}
        />
      ))}
    </Box>
  );
};

export default PostList; 