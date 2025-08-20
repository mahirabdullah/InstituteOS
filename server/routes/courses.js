const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    createCourse, 
    getAllCourses, 
    deleteCourse, 
    getCourseById,
    assignTeacherToCourse,
    enrollStudentInCourse,
    updateCourse
} = require('../controllers/courseController');

router.post('/', auth, createCourse);
router.get('/', auth, getAllCourses);
router.get('/:id', auth, getCourseById);
router.delete('/:id', auth, deleteCourse);
router.put('/:id', auth, updateCourse); // --- NEW ROUTE ---
router.post('/:id/assign-teacher', auth, assignTeacherToCourse);
router.post('/:id/enroll-student', auth, enrollStudentInCourse);

module.exports = router;