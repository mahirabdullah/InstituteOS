// C:\Users\MAHIR\Projects\sms\client\src\pages\TeachersPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for profile
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (err) {
      console.error("Failed to add teacher", err);
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
        <h1>Manage Teachers</h1>
        
        <div className="list-container add-form">
            <h2>Add New Teacher</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" value={name} onChange={onChange} placeholder="Teacher Name" required />
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Teacher Email" required />
                <button type="submit">Add Teacher</button>
            </form>
        </div>

        <div className="list-container">
            <h2>Existing Teachers</h2>
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
                      {/* Link to the profile page we will create next */}
                      <Link to={`/teacher/${teacher._id}`} className="profile-link">{teacher.name}</Link>
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.courses.length}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteTeacher(teacher._id)}>Delete</button>
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