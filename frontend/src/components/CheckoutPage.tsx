import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import { useCart } from '../context/CartContext';

const steps = ['Shipping Information', 'Payment Details', 'Order Review'];

const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePaymentSuccess = () => {
    setSuccess(true);
    clearCart();
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const isShippingInfoValid = () => {
    return Object.values(shippingInfo).every(value => value.trim() !== '');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={shippingInfo.state}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingInfoChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <PaymentForm
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {items.map(item => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography>
                  {item.name} x {item.quantity} - ${(item.price * item.quantity / 100).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${(total / 100).toFixed(2)}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === 0 && !isShippingInfoValid()}
          >
            Next
          </Button>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Payment successful! Thank you for your purchase.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage; 