const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/AuthRouter');
const productRoutes = require('./routes/ProductRoutes');
const CartWishlistRoutes = require('./routes/CartWishlistRoutes');
const RestPasswordRouter = require('./routes/RestPasswordRouter');
const Token = require('./middleware/AuthMiddleware');
// const userRoutes = require('./routes/');
const bodyParser = require('body-parser');


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(bodyParser.json());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/password', RestPasswordRouter);
app.use('/api/Wishlist', Token.verifyToken, CartWishlistRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
