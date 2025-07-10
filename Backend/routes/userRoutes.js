const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // 👈 public route

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // 👈 only logged-in users can see this

router.get('/me', protect, getUserProfile);

// Add a test route to verify API connectivity
router.get('/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

module.exports = router;
