// C:\Users\MAHIR\Projects\sms\client\src\pages\StudentProfilePage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './TeacherProfilePage.css'; // We can reuse the teacher's profile CSS

const StudentProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to fetch student data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) return <div className="dashboard-container"><Sidebar /><main className="main-content">Loading...</main></div>;
  if (!student) return <div className="dashboard-container"><Sidebar /><main className="main-content">Student not found.</main></div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/students" className="back-link">← Back to Students</Link>
        <h1>{student.name}'s Profile</h1>
        <p className="teacher-email">{student.email}</p>

        <div className="list-container">
            <h2>Enrolled Courses</h2>
            {student.courses.length > 0 ? (
                <ul>
                    {student.courses.map(course => (
                        <li key={course._id}>{course.courseName} ({course.courseCode})</li>
                    ))}
                </ul>
            ) : (
                <p>Not enrolled in any courses yet.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default StudentProfilePage;