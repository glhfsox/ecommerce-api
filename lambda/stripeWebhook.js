const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log('Environment variables:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
  });

  console.log('Received webhook event:', {
    headers: event.headers,
    body: typeof event.body === 'string' ? event.body : JSON.stringify(event.body)
  });

  try {
    const sig = event.headers['stripe-signature'];
    const payload = event.body;

    if (!sig) {
      console.error('No Stripe signature found in headers');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No Stripe signature found' })
      };
    }

    console.log('Attempting to verify webhook signature...');
    
    // Verify the webhook signature
    const webhookEvent = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event type:', webhookEvent.type);
    console.log('Webhook event data:', JSON.stringify(webhookEvent.data, null, 2));

    // Handle the event
    switch (webhookEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = webhookEvent.data.object;
        console.log('PaymentIntent was successful!', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          customer: paymentIntent.customer,
          metadata: paymentIntent.metadata
        });
        // Add your logic here to update order status, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = webhookEvent.data.object;
        console.log('PaymentIntent failed!', {
          paymentIntentId: failedPayment.id,
          lastPaymentError: failedPayment.last_payment_error,
          failureMessage: failedPayment.last_payment_error?.message
        });
        // Add your logic here to handle failed payments
        break;

      case 'payment_intent.canceled':
        const canceledPayment = webhookEvent.data.object;
        console.log('PaymentIntent was canceled!', {
          paymentIntentId: canceledPayment.id,
          cancellationReason: canceledPayment.cancellation_reason,
          metadata: canceledPayment.metadata
        });
        // Add your logic here to handle canceled payments
        break;

      case 'charge.succeeded':
        const charge = webhookEvent.data.object;
        console.log('Charge was successful!', {
          chargeId: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          paymentIntent: charge.payment_intent,
          metadata: charge.metadata
        });
        // Add your logic here to handle successful charges
        break;

      case 'charge.failed':
        const failedCharge = webhookEvent.data.object;
        console.log('Charge failed!', {
          chargeId: failedCharge.id,
          failureMessage: failedCharge.failure_message,
          paymentIntent: failedCharge.payment_intent,
          metadata: failedCharge.metadata
        });
        // Add your logic here to handle failed charges
        break;

      default:
        console.log(`Unhandled event type ${webhookEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        received: true, 
        eventType: webhookEvent.type,
        timestamp: new Date().toISOString()
      })
    };
  } catch (err) {
    console.error('Error processing webhook:', {
      message: err.message,
      stack: err.stack,
      type: err.type
    });
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: err.message,
        type: err.type,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 