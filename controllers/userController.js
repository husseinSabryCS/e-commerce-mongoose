const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../models/ProductModel');

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if product is already in the cart
    const productIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
      // If not, add it to the cart
      user.cart.push({ product: productId });
    } else {
      // If it exists, increment the quantity
      user.cart[productIndex].quantity += 1;
    }

    await user.save();
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
 // Assuming you have a Product model

 exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes `req.user` contains the authenticated user's data
    const productId = req.body.productId;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add product to user's wishlist if not already added
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    } else {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes `req.user` contains the authenticated user's data
    const productId = req.params.productId;

    // Check if the product exists in the wishlist
    const user = await User.findById(userId);
    const productIndex = user.wishlist.indexOf(productId);

    if (productIndex !== -1) {
      user.wishlist.splice(productIndex, 1); // Remove the product from wishlist
      await user.save();
      return res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } else {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


