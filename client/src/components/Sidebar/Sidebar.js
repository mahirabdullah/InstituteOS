// C:\Users\MAHIR\Projects\sms\client\src\components\Sidebar\Sidebar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SMS Admin</h2>
      </div>
      <ul className="sidebar-menu">
        {/* Use Link component for internal navigation */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/teachers">Teachers</Link></li>
        <li><Link to="/students">Students</Link></li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;