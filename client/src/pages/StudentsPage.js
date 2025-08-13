// C:\Users\MAHIR\Projects\sms\client\src\pages\StudentsPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css'; // We can reuse the same stylesheet

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    fetchStudents();
  }, []);

  const { name, email } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/students', formData);
      setStudents([res.data, ...students]);
      setFormData({ name: '', email: '' }); // Clear form
    } catch (err) {
      console.error("Failed to add student", err);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        try {
            await api.delete(`/students/${id}`);
            setStudents(students.filter(student => student._id !== id));
        } catch (err) {
            console.error("Failed to delete student", err);
        }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1>Manage Students</h1>
        
        <div className="list-container add-form">
            <h2>Add New Student</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" value={name} onChange={onChange} placeholder="Student Name" required />
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Student Email" required />
                <button type="submit">Add Student</button>
            </form>
        </div>

        <div className="list-container">
            <h2>Existing Students</h2>
            <input 
              type="text" 
              placeholder="Search students..." 
              className="search-bar"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrolled Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td>
                      {/* We'll link to a profile page later */}
                      {student.name}
                    </td>
                    <td>{student.email}</td>
                    <td>{student.courses.length}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteStudent(student._id)}>Delete</button>
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

export default StudentsPage;