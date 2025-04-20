const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderAsDelivered,
  updateOrderToPaid
} = require('../controllers/orderController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Logged-in user routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/deliver', protect, isAdmin, markOrderAsDelivered);

router.put('/:id/pay', protect, updateOrderToPaid);
module.exports = router;
