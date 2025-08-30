import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './TeacherProfilePage.css';

const TeacherProfilePage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/teachers/${id}`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">Loading...</main>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">Teacher not found.</main>
      </div>
    );
  }

  // Filter courses into active and completed lists
  const activeCourses = teacher.courses.filter(course => course.status === 'Active');
  const completedCourses = teacher.courses.filter(course => course.status === 'Completed');

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/teachers" className="back-link">← Back to Teachers</Link>
        <h1>{teacher.name}'s Profile</h1>
        <p className="teacher-email">{teacher.email}</p>
        
        <div className="profile-grid">
            <div className="list-container">
                <h2>Active Courses</h2>
                {activeCourses.length > 0 ? (
                    <ul>
                        {activeCourses.map(course => (
                            <li key={course._id}>{course.courseName} ({course.courseCode})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No active courses assigned.</p>
                )}
            </div>

            <div className="list-container">
                <h2>Previously Taught Courses</h2>
                {completedCourses.length > 0 ? (
                    <ul>
                        {completedCourses.map(course => (
                            <li key={course._id}>{course.courseName} ({course.courseCode})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No completed courses.</p>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfilePage;