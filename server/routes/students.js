const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  createStudent, 
  getAllStudents, 
  getStudentById,
  deleteStudent,
  enrollStudentInCourse,
  updateStudent
} = require('../controllers/studentController');

router.post('/', auth, createStudent);
router.get('/', auth, getAllStudents);
router.get('/:id', auth, getStudentById);
router.delete('/:id', auth, deleteStudent);
router.put('/:id', auth, updateStudent); // --- NEW ROUTE ---
router.post('/:id/enroll', auth, enrollStudentInCourse);

module.exports = router;