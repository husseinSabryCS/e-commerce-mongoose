const express = require('express');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const { uploadCategoryImage, resizeImage } = require('../middleware/multer'); // تأكد من المسار الصحيح
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct ,getProductsByCategory} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.post('/',uploadCategoryImage, // تحميل الصورة
    resizeImage, // تغيير حجم الصورة
    addProduct, addProduct);
router.put('/:id',updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
