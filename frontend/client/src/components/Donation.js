import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

// Stripe 公鑰
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// 支付表單組件
const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // 創建支付意圖
      const { data: { clientSecret } } = await axios.post(
        API_ENDPOINTS.PAYMENT.CREATE_INTENT,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // 確認支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user.email,
              name: user.username
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // 更新用戶捐款狀態
        await axios.post(
          API_ENDPOINTS.PAYMENT.UPDATE_STATUS,
          { status: 'yes' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || processing}
        fullWidth
        sx={{
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        {processing ? '處理中...' : `支付 NT$ ${amount}`}
      </Button>
    </form>
  );
};

// 主捐款頁面
const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const donationOptions = [
    { amount: 100, description: '支持作者一杯咖啡' },
    { amount: 500, description: '支持作者一頓晚餐' },
    { amount: 1000, description: '支持作者持續創作' }
  ];

  const handleSuccess = () => {
    setSuccess(true);
    // 重新加載用戶信息或更新狀態
    window.location.reload();
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          感謝您的捐款支持！
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          支持作者
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          您的支持是我持續創作的動力
        </Typography>

        {!selectedAmount ? (
          <Grid container spacing={3}>
            {donationOptions.map((option) => (
              <Grid item xs={12} sm={4} key={option.amount}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      NT$ {option.amount}
                    </Typography>
                    <Typography variant="body2">
                      {option.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained"
                      onClick={() => setSelectedAmount(option.amount)}
                    >
                      選擇
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom align="center">
              捐款金額：NT$ {selectedAmount}
            </Typography>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                amount={selectedAmount} 
                onSuccess={handleSuccess}
              />
            </Elements>
            <Button
              sx={{ mt: 2 }}
              onClick={() => setSelectedAmount(null)}
            >
              選擇其他金額
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Donation; 