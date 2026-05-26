import React from 'react';
import { Button } from '@mui/material';

const DonateButton = () => {
  const handleClick = () => {
    // Use window.open to open the payment link in a new tab
    window.open('https://buy.stripe.com/test_4gw9Bg3xU0Nh2R2dQQ', '_blank');
  };

  return (
    <Button
      variant="contained"
      color="button_donate"
      onClick={handleClick}
    >
      Donate Now
    </Button>
  );
};

export default DonateButton; 