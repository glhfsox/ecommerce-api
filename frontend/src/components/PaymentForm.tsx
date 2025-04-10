import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import { Button, Box, Typography, CircularProgress, Divider } from '@mui/material';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentFormComponent: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (e) => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        const { clientSecret } = await response.json();

        const { error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: e.paymentMethod.id,
          },
          { handleActions: false }
        );

        if (confirmError) {
          e.complete('fail');
          onError(confirmError.message || 'Payment failed');
        } else {
          e.complete('success');
          onSuccess();
        }
      } catch (error) {
        e.complete('fail');
        onError('An error occurred during payment processing');
      } finally {
        setLoading(false);
      }
    });
  }, [stripe, amount, onSuccess, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        onError(stripeError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('An error occurred during payment processing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentRequest && (
        <>
          <Box sx={{ mb: 2 }}>
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              className="PaymentRequestButton"
            />
          </Box>
          <Divider sx={{ my: 2 }}>OR</Divider>
        </>
      )}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!stripe || loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : `Pay $${amount / 100}`}
      </Button>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <PaymentFormComponent {...props} />
      </Box>
    </Elements>
  );
};

export default PaymentForm; 