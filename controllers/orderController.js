const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) return res.status(404).json({ error: 'Active cart not found' });

    const cartItems = await CartItem.findAll({ where: { cart_id: cart.id } });
    const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price_at_checkout, 0);

    const order = await Order.create({ user_id: req.user.id, total_price: totalPrice });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: 'usd',
      metadata: { orderId: order.id },
      receipt_email: req.user.email,
    });

    await Payment.create({
      order_id: order.id,
      stripe_payment_intent: paymentIntent.id,
      amount: totalPrice,
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};