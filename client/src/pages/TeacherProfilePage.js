// C:\Users\MAHIR\Projects\sms\client\src\pages\TeacherProfilePage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './TeacherProfilePage.css';

const TeacherProfilePage = () => {
  const { id } = useParams(); // Get teacher ID from URL
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeacherData = async () => {
    try {
      const teacherRes = await api.get(`/teachers/${id}`);
      setTeacher(teacherRes.data);
    } catch (err) {
      setError('Could not fetch teacher data.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch both teacher details and all available courses
        await Promise.all([fetchTeacherData(), api.get('/courses').then(res => setCourses(res.data))]);
      } catch (err) {
        setError('Failed to load page data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert('Please select a course to assign.');
      return;
    }
    try {
      await api.post(`/teachers/${id}/assign-course`, { courseId: selectedCourse });
      // Refetch teacher data to show the new course in the list
      fetchTeacherData(); 
      setSelectedCourse('');
      alert('Course assigned successfully!');
    } catch (err) {
      console.error('Failed to assign course', err);
      alert('Error assigning course. The teacher may already be assigned.');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!teacher) return <div>Teacher not found.</div>;

  // Filter out courses the teacher is already assigned to
  const availableCourses = courses.filter(course => 
    !teacher.courses.some(assignedCourse => assignedCourse._id === course._id)
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/teachers" className="back-link">← Back to Teachers</Link>
        <h1>{teacher.name}'s Profile</h1>
        <p className="teacher-email">{teacher.email}</p>

        <div className="profile-details-grid">
            {/* Assigned Courses Section */}
            <div className="list-container">
                <h2>Assigned Courses</h2>
                {teacher.courses.length > 0 ? (
                    <ul>
                        {teacher.courses.map(course => (
                            <li key={course._id}>{course.courseName} ({course.courseCode})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses assigned yet.</p>
                )}
            </div>
            
            {/* Assign New Course Section */}
            <div className="list-container add-form">
                <h2>Assign New Course</h2>
                <form onSubmit={handleAssignCourse}>
                    <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
                        <option value="">-- Select a course --</option>
                        {availableCourses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Assign</button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfilePage;