import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/Auth/AdminLogin';
import AdminSignUp from './components/Auth/AdminSignUp';
import AdminDashboard from './components/Admin/AdminDashboard';
import CertificateDownloader from './components/Public/CertificateDownloader';

function App() {
    return (
        <Router>
            <Routes>
              
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/signup" element={<AdminSignUp />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/certificate" element={<CertificateDownloader />} />
            </Routes>
        </Router>
    );
}

export default App;