const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById,
  deleteTeacher,
  assignCourseToTeacher,
  updateTeacher
} = require('../controllers/teacherController');

router.post('/', auth, createTeacher);
router.get('/', auth, getAllTeachers);
router.get('/:id', auth, getTeacherById);
router.delete('/:id', auth, deleteTeacher);
router.put('/:id', auth, updateTeacher); // --- NEW ROUTE ---
router.post('/:id/assign-course', auth, assignCourseToTeacher);

module.exports = router;