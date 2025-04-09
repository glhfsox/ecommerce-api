const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cart_id: cart.id, product_id: productId, quantity, price_at_checkout: product.price });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.cartItemId);
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    await cartItem.destroy();
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) return res.status(404).json({ error: 'Active cart not found' });

    const cartItems = await CartItem.findAll({ where: { cart_id: cart.id } });
    const totalCost = cartItems.reduce((total, item) => total + item.quantity * item.price_at_checkout, 0);

    res.json({ cartItems, totalCost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};