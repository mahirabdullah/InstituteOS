const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    createCourse, 
    getAllCourses, 
    getCourseById,
    getCompletedCourses,
    updateCourse,
    deleteCourse, 
    assignTeacherToCourse,
    unassignTeacherFromCourse,
    enrollStudentInCourse,
    unenrollStudentFromCourse,
    completeCourse
} = require('../controllers/courseController');

// General routes
router.post('/', auth, createCourse);
router.get('/', auth, getAllCourses);
router.get('/view/completed', auth, getCompletedCourses); 

// Routes specific to a course ID
router.get('/:id', auth, getCourseById);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);
router.put('/:id/complete', auth, completeCourse);

// Routes for managing teachers/students in a course
router.post('/:id/assign-teacher', auth, assignTeacherToCourse);
router.post('/:id/unassign-teacher', auth, unassignTeacherFromCourse);
router.post('/:id/enroll-student', auth, enrollStudentInCourse);
router.post('/:id/unenroll-student', auth, unenrollStudentFromCourse);

module.exports = router;