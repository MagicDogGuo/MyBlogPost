import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const PostList = ({ posts, onDelete, onEdit }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} key={post.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Author: {post.names}
              </Typography>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {post.contentTexts}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                Published: {new Date(post.date).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => onEdit(post)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(post.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList; 