const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  createStudent, 
  getAllStudents, 
  getStudentById,
  deleteStudent,
  updateStudent,
  getStudentProfileData
} = require('../controllers/studentController');

router.post('/', auth, createStudent);
router.get('/', auth, getAllStudents);
router.get('/:id/profile', auth, getStudentProfileData);
router.get('/:id', auth, getStudentById);
router.delete('/:id', auth, deleteStudent);
router.put('/:id', auth, updateStudent);

module.exports = router;