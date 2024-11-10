const Product = require('../models/ProductModel');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    console.log(name, description, price, category);

    const photos = req.files ? req.files.map(file => file.path) : [];
    console.log(photos);

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      photos
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error); // لطباعة الخطأ في حال حدوثه
    res.status(500).json({ error: 'Server error' });
  }
};
// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const photos = req.files.map(file => file.path); // Update with new photos if any

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, photos },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (error) {  
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params; // Assuming the category is passed as a URL parameter

  try {
    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};