const express = require('express');
const {
  signup,
  login,
  getAllUsers,
  getEmployees
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/signup',signup);
router.get('/users', authenticateToken, getAllUsers);
router.get('/employees', authenticateToken, getEmployees);

module.exports = router;
