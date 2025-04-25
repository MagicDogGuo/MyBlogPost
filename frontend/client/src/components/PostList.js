import React from 'react';
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
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const PostList = ({ posts, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
              <CardActions>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    Read More
                  </Button>
                  {isAdmin && (
                    <>
                      <Tooltip title="Edit Post">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => onEdit(post)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => onDelete(post._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostList; 