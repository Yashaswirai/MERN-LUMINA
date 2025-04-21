const express = require('express');
const router = express.Router();
const upload = require('../utils/upload'); // Import the upload middleware
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public product routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Route to serve product images
router.get('/:id/image', getProductImage);

// Admin-only route 
router.post('/add', protect, isAdmin, upload.single('image'), addProduct); // 👈 admin access only
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
