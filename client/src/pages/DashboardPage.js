// C:\Users\MAHIR\Projects\sms\client\src\pages\DashboardPage.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel for efficiency
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
        
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your school today.</p>
        
        <div className="stats-cards">
          <div className="card">
            <h3>Total Courses</h3>
            <p>{loading ? '...' : stats.courses}</p>
          </div>
          <div className="card">
            <h3>Total Students</h3>
            <p>{loading ? '...' : stats.students}</p>
          </div>
          <div className="card">
            <h3>Total Teachers</h3>
            <p>{loading ? '...' : stats.teachers}</p>
          </div>
        </div>

        {/* You can build out these list sections next */}
        <div className="list-section">
            <div className="list-container">
                <h2>Recent Additions</h2>
                <p>This section can show recently added students or teachers.</p>
            </div>
            <div className="list-container">
                <h2>Quick Links</h2>
                <p>This section can have links to add new items quickly.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;