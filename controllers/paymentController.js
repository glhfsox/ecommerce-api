const { createPaymentIntent, verifyPayment } = require('../config/stripe');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createPayment = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const { clientSecret, paymentIntentId } = await createPaymentIntent(amount, currency);

    res.json({
      clientSecret,
      paymentIntentId
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isPaymentSuccessful = await verifyPayment(paymentIntentId);

    if (!isPaymentSuccessful) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid', paymentIntentId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );

    res.json({
      message: 'Payment confirmed successfully',
      order
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

module.exports = {
  createPayment,
  confirmPayment
};