import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Assume clicking a tag navigates to a route
import './RecommendedTopics.css'; // Import the CSS file

// Placeholder data
const placeholderTopics = [
  'Finance', 'Blockchain', 'AI', 'Business', 'Sustainability', 'Lifestyle', 'Technology', 'Environment'
];

const RecommendedTopics = () => {
  // Data can be fetched from API in the future
  const topics = placeholderTopics;

  return (
    <Paper elevation={0} className="recommended-topics-paper">
      <Typography variant="h6" className="recommended-topics-title">
        Recommended Topics
      </Typography>
      <Box className="recommended-topics-chip-container">
        {topics.map((topic) => (
          <Chip 
            key={topic} 
            label={topic} 
            component={RouterLink} 
            to={`/tags/${encodeURIComponent(topic)}`}
            clickable 
            className="recommended-topic-chip"
          />
        ))}
      </Box>
    </Paper>
  );
};

export default RecommendedTopics; 