const express = require('express');
const multer = require('multer')
const fs = require('fs');
const { 
  createEmployee, 
  getAllEmployees, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee, 
  isManager 
} = require('../controllers/employeeController');
const authenticateToken= require('../middleware/authMiddleware')
const router = express.Router();
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../cvs');
  },
  filename: (req, file, cb) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeFilename}`);
  },
});

const upload = multer({storage})

router.post('/',upload.single('cv'),authenticateToken,isManager, createEmployee);
router.get('/',authenticateToken,getAllEmployees);
router.get('/:id',authenticateToken,isManager,getEmployeeById);
router.put('/:id',authenticateToken,isManager, updateEmployee);
router.delete('/:id',authenticateToken,isManager, deleteEmployee);

module.exports = router;

