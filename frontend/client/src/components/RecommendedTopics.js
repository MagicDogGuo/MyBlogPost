import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // 假設點擊標籤可以導航

// 佔位數據
const placeholderTopics = [
  'Data Science', 'Self Improvement', 'Writing', 'Relationships', 'Cryptocurrency', 'Politics', 'Technology', 'Productivity'
];

const RecommendedTopics = () => {
  // 將來可以從 API 獲取數據
  const topics = placeholderTopics;

  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Recommended Topics
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {topics.map((topic) => (
          <Chip 
            key={topic} 
            label={topic} 
            component={RouterLink} 
            to={`/topics/${topic.toLowerCase().replace(/\s+/g, '-')}`} // 生成 topic 鏈接
            clickable 
            sx={{ 
              backgroundColor: '#e9ecef', 
              color: '#495057', 
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: '#ced4da'
              }
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default RecommendedTopics; 