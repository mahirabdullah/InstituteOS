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

  if (loading) return <div>Loading...</div>;
  if (!teacher) return <div>Teacher not found.</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/teachers" className="back-link">← Back to Teachers</Link>
        <h1>{teacher.name}'s Profile</h1>
        <p className="teacher-email">{teacher.email}</p>

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
      </main>
    </div>
  );
};

export default TeacherProfilePage;