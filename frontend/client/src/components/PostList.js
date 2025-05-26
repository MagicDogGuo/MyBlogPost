import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const PostList = ({ posts, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [isUpdating, setIsUpdating] = useState({});

  // 在 useEffect 外面打印一次，看看初始 props 和 user
  console.log('[PostList Diagnostics] Initial props - posts:', JSON.stringify(posts));
  console.log('[PostList Diagnostics] Initial context - user:', JSON.stringify(user));

  // 初始化按讚狀態
  useEffect(() => {
    console.log('[PostList Diagnostics] useEffect triggered. User:', JSON.stringify(user));
    console.log('[PostList Diagnostics] useEffect triggered. Posts:', JSON.stringify(posts));

    if (posts && user && user.id) {
      const currentUserIdStr = String(user.id);
      console.log('[PostList Diagnostics] Current User ID (string):', currentUserIdStr);
      const newLikedState = {};
      const newLikeCounts = {};

      posts.forEach(post => {
        if (!post || !post._id) {
          console.warn('[PostList Diagnostics] Invalid post object:', JSON.stringify(post));
          return;
        }
        const postId = post._id;
        const likesArray = Array.isArray(post.likes) ? post.likes : [];
        let likedByCurrentUser = false;

        console.log(`[PostList Diagnostics] Processing Post ID: ${postId}, Likes Array on post:`, JSON.stringify(likesArray));

        for (const likeItem of likesArray) {
          let itemId = null;
          if (typeof likeItem === 'string' || typeof likeItem === 'number') {
            itemId = String(likeItem);
          } else if (likeItem && typeof likeItem === 'object' && likeItem.user !== undefined) {
            itemId = String(likeItem.user);
          } else if (likeItem && typeof likeItem === 'object' && likeItem._id !== undefined) {
            console.warn(`[PostList Diagnostics] likeItem for Post ${postId} has ._id but not .user. Using ._id as fallback. likeItem:`, JSON.stringify(likeItem));
            itemId = String(likeItem._id);
          }
          
          if (itemId !== null) {
            console.log(`[PostList Diagnostics] Comparing: Post ${postId}, Item ID: ${itemId}, Current User ID: ${currentUserIdStr}`);
            if (itemId === currentUserIdStr) {
              likedByCurrentUser = true;
              console.log(`[PostList Diagnostics] Match found for Post ID: ${postId}`);
              break;
            }
          } else {
            console.warn(`[PostList Diagnostics] Invalid likeItem structure in Post ID ${postId}:`, JSON.stringify(likeItem));
          }
        }
        
        newLikedState[postId] = likedByCurrentUser;
        newLikeCounts[postId] = likesArray.length;
      });

      console.log('[PostList Diagnostics] Calculated newLikedState:', JSON.stringify(newLikedState));
      setLikedPosts(newLikedState);
      setLikeCounts(newLikeCounts);
    } else {
      console.log('[PostList Diagnostics] useEffect: posts or user or user.id is missing. Clearing states.');
      setLikedPosts({});
      setLikeCounts({});
    }
  }, [user, posts]);

  const handleLike = useCallback(async (postId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 如果正在更新中，直接返回
    if (isUpdating[postId]) {
      return;
    }

    // 保存當前狀態
    const currentLiked = likedPosts[postId];
    const currentCount = likeCounts[postId];
    
    // 設置更新狀態
    setIsUpdating(prev => ({
      ...prev,
      [postId]: true
    }));

    // 計算新的狀態
    const newLikedState = !currentLiked;
    const newCount = currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    // 更新本地狀態
    setLikedPosts(prev => ({
      ...prev,
      [postId]: newLikedState
    }));
    
    setLikeCounts(prev => ({
      ...prev,
      [postId]: newCount
    }));

    // 更新 posts 數據
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const updatedLikes = newLikedState
          ? [...(post.likes || []), user._id]
          : (post.likes || []).filter(id => id !== user._id);
        return {
          ...post,
          likes: updatedLikes,
          likeCount: updatedLikes.length // 更新點讚數量
        };
      }
      return post;
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.POSTS.LIKE(postId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // 使用後端返回的數據更新狀態
      if (response.data) {
        if (response.data.likeCount !== undefined) {
          setLikeCounts(prev => ({
            ...prev,
            [postId]: response.data.likeCount
          }));
        }
        // 優先使用後端返回的按讚狀態 (例如 isLiked: boolean 或完整的 likes 數組)
        // 假設後端可能返回 { likeCount: 10, isLiked: true } 或 { likeCount: 10, likes: ['userId1', 'userId2'] }
        if (response.data.isLiked !== undefined && typeof response.data.isLiked === 'boolean') {
          setLikedPosts(prev => ({
            ...prev,
            [postId]: response.data.isLiked
          }));
        } else if (response.data.likes && Array.isArray(response.data.likes) && user?._id) {
          setLikedPosts(prev => ({
            ...prev,
            [postId]: response.data.likes.includes(user._id)
          }));
        }
        // 如果後端沒有返回明確的 isLiked 或 likes 數組, 
        // likedPosts 狀態將依賴於之前的樂觀更新。
      }
      
    } catch (error) {
      // 如果請求失敗，恢復原始狀態
      setLikedPosts(prev => ({
        ...prev,
        [postId]: currentLiked
      }));
      
      setLikeCounts(prev => ({
        ...prev,
        [postId]: currentCount
      }));
      
      // 恢復原始 posts 數據
      const originalPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: post.likes || [],
            likeCount: (post.likes || []).length
          };
        }
        return post;
      });
      
      console.error('Error liking post:', error);
    } finally {
      // 清除更新狀態
      setIsUpdating(prev => ({
        ...prev,
        [postId]: false
      }));
    }
  }, [user, likedPosts, likeCounts, isUpdating, navigate, posts]);

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Author: {post.author?.username || 'Unknown'}
                </Typography>
                <Typography variant="body1" component="p" sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.content}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  Published: {new Date(post.createdAt).toLocaleString()}
                </Typography>
                {post.tags && post.tags.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {post.tags.map((tag, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          mr: 1,
                          p: 0.5,
                          bgcolor: 'primary.light',
                          color: 'white',
                          borderRadius: 1
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => navigate(`/posts/${post._id}`)}
                    startIcon={<Icons.ArrowForward />}
                  >
                    Read More
                  </Button>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleLike(post._id)}
                      disabled={isUpdating[post._id]}
                      sx={{ 
                        color: likedPosts[post._id] ? '#ff4081' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 64, 129, 0.08)'
                        },
                        '&:disabled': {
                          opacity: 0.7
                        }
                      }}
                    >
                      {likedPosts[post._id] ? (
                        <Icons.Favorite />
                      ) : (
                        <Icons.FavoriteBorder />
                      )}
                    </IconButton>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 0.5,
                        color: likedPosts[post._id] ? '#ff4081' : 'text.secondary',
                        fontWeight: likedPosts[post._id] ? 'bold' : 'normal',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {likeCounts[post._id] || 0}
                    </Typography>
                  </Box>
                </Box>

                {isAdmin && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => onEdit(post)}
                    >
                      <Icons.Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => onDelete(post._id)}
                    >
                      <Icons.Delete />
                    </IconButton>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostList; 