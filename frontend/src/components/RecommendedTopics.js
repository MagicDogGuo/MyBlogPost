import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // 假設點擊標籤可以導航
import './RecommendedTopics.css'; // Import the CSS file

// 佔位數據
const placeholderTopics = [
  'Finance', 'Blockchain', 'AI', 'Business', 'Sustainability', 'Lifestyle', 'Technology', 'Environment'
];

const RecommendedTopics = () => {
  // 將來可以從 API 獲取數據
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