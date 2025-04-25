import React from 'react';
import { Button } from '@mui/material';

const DonateButton = () => {
  const handleClick = () => {
    // 使用 window.open 在新標籤頁中打開付款鏈接
    window.open('https://buy.stripe.com/test_4gw9Bg3xU0Nh2R2dQQ', '_blank');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      sx={{
        backgroundColor: '#4CAF50',
        '&:hover': {
          backgroundColor: '#45a049',
        },
      }}
    >
      Donate Now
    </Button>
  );
};

export default DonateButton; 