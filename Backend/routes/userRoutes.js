const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // 👈 only logged-in users can see this

module.exports = router;
