// C:\Users\MAHIR\Projects\sms\client\src\App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage'; 
import TeachersPage from './pages/TeachersPage'; 
import StudentsPage from './pages/StudentsPage'; 
import TeacherProfilePage from './pages/TeacherProfilePage';
import CourseDetailPage from './pages/CourseDetailPage';
import StudentProfilePage from './pages/StudentProfilePage'; // <-- IMPORT NEW PAGE
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
        <Route path="/teachers" element={<PrivateRoute><TeachersPage /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
        <Route path="/teacher/:id" element={<PrivateRoute><TeacherProfilePage /></PrivateRoute>} />
        <Route path="/course/:id" element={<PrivateRoute><CourseDetailPage /></PrivateRoute>} />
        <Route path="/student/:id" element={<PrivateRoute><StudentProfilePage /></PrivateRoute>} /> {/* <-- ADD NEW ROUTE */}
        
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;