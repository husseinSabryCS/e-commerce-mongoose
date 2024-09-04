const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct ,getProductsByCategory} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.post('/',upload.array('photos'), addProduct);
router.put('/:id',upload.array('photos'),updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
