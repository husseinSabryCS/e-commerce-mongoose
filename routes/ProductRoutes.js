const express = require('express');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const { uploadCategoryImage, resizeImage } = require('../middleware/multer'); // تأكد من المسار الصحيح
<<<<<<< HEAD
const { getAllProducts, getProductById, addProduct, updateProductById, deleteProduct ,getProductsByCategory} = require('../controllers/productController');
=======
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct ,getProductsByCategory} = require('../controllers/productController');
>>>>>>> 8611abcf15819f6c254519ee80fd7f8f4211285a

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
<<<<<<< HEAD
// Route to add a new product with image upload and resize middleware
router.post('/', uploadCategoryImage, resizeImage, addProduct);

router.put('/:id', uploadCategoryImage, resizeImage, updateProductById);
=======
router.post('/',uploadCategoryImage, // تحميل الصورة
    resizeImage, // تغيير حجم الصورة
    addProduct, addProduct);
router.put('/:id',updateProduct);
>>>>>>> 8611abcf15819f6c254519ee80fd7f8f4211285a
router.delete('/:id', deleteProduct);

module.exports = router;
