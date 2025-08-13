// C:\Users\MAHIR\Projects\sms\server\routes\students.js

const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getAllStudents, 
  getStudentById,
  deleteStudent,
  enrollStudentInCourse
} = require('../controllers/studentController');

const auth = require('../middleware/authMiddleware'); // Import middleware

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.delete('/:id', deleteStudent);
router.post('/:id/enroll', enrollStudentInCourse);

module.exports = router;