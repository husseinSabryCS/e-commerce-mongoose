const express = require('express');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const { uploadCategoryImage, resizeImage } = require('../middleware/multer'); // تأكد من المسار الصحيح
const { getAllProducts, getProductById, addProduct, updateProductById, deleteProduct ,getProductsByCategory} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
// Route to add a new product with image upload and resize middleware
router.post('/', uploadCategoryImage, resizeImage, addProduct);

router.put('/:id', uploadCategoryImage, resizeImage, updateProductById);
router.delete('/:id', deleteProduct);

module.exports = router;
