const express = require('express');
const { addToCart, removeFromCart, addToWishlist, removeFromWishlist,getWishlist } = require('../controllers/userController');
const Token = require('../middleware/AuthMiddleware');
const { get } = require('mongoose');

const router = express.Router();

router.post('/cart',  addToCart);
router.delete('/cart/:productId', removeFromCart);
router.post('/wishlist', addToWishlist)
router.get('/wishlist', getWishlist);
router.delete('/wishlist/:productId',  removeFromWishlist);

module.exports = router;
 