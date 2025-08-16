// C:\Users\MAHIR\Projects\sms\client\src\pages\TeachersPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css'; // Reusing the same stylesheet

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/teachers');
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const { name, email } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/teachers', formData);
      setTeachers([res.data, ...teachers]);
      setFormData({ name: '', email: '' });
      setIsFormVisible(false);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to add teacher";
      alert(errorMsg);
      console.error(err);
    }
  };

  const deleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
        try {
            await api.delete(`/teachers/${id}`);
            setTeachers(teachers.filter(teacher => teacher._id !== id));
        } catch (err) {
            console.error("Failed to delete teacher", err);
        }
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="list-page-header">
          <h1>Manage Teachers</h1>
          <button onClick={() => setIsFormVisible(!isFormVisible)} className="add-button">
            {isFormVisible ? 'Cancel' : '+ Add Teacher'}
          </button>
        </div>

        {isFormVisible && (
          <div className="list-container" style={{marginBottom: '20px'}}>
              {/* === UPDATED FORM STARTS HERE === */}
              <form onSubmit={onSubmit} className="add-item-form">
                <div className="form-grid">
                  <div className="form-control">
                    <label htmlFor="name">Teacher Name</label>
                    <input id="name" type="text" name="name" value={name} onChange={onChange} required />
                  </div>
                  <div className="form-control">
                    <label htmlFor="email">Teacher Email</label>
                    <input id="email" type="email" name="email" value={email} onChange={onChange} required />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit">Save Teacher</button>
                </div>
              </form>
              {/* === UPDATED FORM ENDS HERE === */}
          </div>
        )}

        <div className="list-container">
          <input 
            type="text" 
            placeholder="Search teachers..." 
            className="search-bar"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher._id}>
                  <td>
                    <Link to={`/teacher/${teacher._id}`} className="profile-link">{teacher.name}</Link>
                  </td>
                  <td>{teacher.email}</td>
                  <td>{teacher.courses.length}</td>
                  <td className="action-buttons">
                    <button title="Edit">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => deleteTeacher(teacher._id)} title="Delete">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TeachersPage;