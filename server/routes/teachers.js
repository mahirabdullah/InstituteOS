// C:\Users\MAHIR\Projects\sms\server\routes\teachers.js

const express = require('express');
const router = express.Router();
const { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById,
  deleteTeacher,
  assignCourseToTeacher
} = require('../controllers/teacherController');

const auth = require('../middleware/authMiddleware'); // Import middleware

// We'll add auth middleware later
router.post('/', createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.delete('/:id', deleteTeacher);
router.post('/:id/assign-course', assignCourseToTeacher);

module.exports = router;