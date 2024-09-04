const express = require('express');
const { addToCart, removeFromCart, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/cart', auth, addToCart);
router.delete('/cart/:productId', auth, removeFromCart);
router.post('/wishlist', auth, addToWishlist);
router.delete('/wishlist/:productId', auth, removeFromWishlist);

module.exports = router;
 