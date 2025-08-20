import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [loading, setLoading] = useState(true);
  
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, studentsRes, teachersRes] = await Promise.all([
          api.get('/courses'),
          api.get('/students'),
          api.get('/teachers')
        ]);
        
        setStats({
          courses: coursesRes.data.length,
          students: studentsRes.data.length,
          teachers: teachersRes.data.length
        });

        const sortedStudents = [...studentsRes.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentStudents(sortedStudents.slice(0, 5));

        const sortedTeachers = [...teachersRes.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentTeachers(sortedTeachers.slice(0, 5));
        
        setCourseList(coursesRes.data.slice(0, 5));
        
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your school today.</p>
        
        <div className="stats-cards">
          <div className="card">
            <h3>Total Students</h3>
            <p className="stat-number">{loading ? '...' : stats.students}</p>
          </div>
          <div className="card">
            <h3>Total Teachers</h3>
            <p className="stat-number">{loading ? '...' : stats.teachers}</p>
          </div>
          <div className="card">
            <h3>Total Courses</h3>
            <p className="stat-number">{loading ? '...' : stats.courses}</p>
          </div>
        </div>

        <div className="dashboard-lists">
            <div className="list-widget">
                <h2>Recently Added Students</h2>
                <table>
                    <tbody>
                        {recentStudents.map(student => (
                          <tr key={student._id}><td>{student.name}</td></tr>
                        ))}
                        {recentStudents.length === 0 && !loading && (
                          <tr><td>No recent students.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="list-widget">
                <h2>Recently Joined Teachers</h2>
                <table>
                    <tbody>
                        {recentTeachers.map(teacher => (
                          <tr key={teacher._id}><td>{teacher.name}</td></tr>
                        ))}
                         {recentTeachers.length === 0 && !loading && (
                          <tr><td>No recent teachers.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="list-widget">
                <h2>Course Overview</h2>
                 <table>
                    <tbody>
                       {courseList.map(course => (
                          <tr key={course._id}><td>{course.courseName}</td></tr>
                        ))}
                        {courseList.length === 0 && !loading && (
                          <tr><td>No courses created yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;