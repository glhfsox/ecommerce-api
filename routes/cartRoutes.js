const express = require('express');
const { addToCart, removeFromCart, viewCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/', addToCart);
router.delete('/:cartItemId', removeFromCart);
router.get('/', viewCart);

module.exports = router;