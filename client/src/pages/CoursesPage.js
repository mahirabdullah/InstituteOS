// C:\Users\MAHIR\Projects\sms\client\src\pages\CoursesPage.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css'; // A generic stylesheet for all list pages

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ courseName: '', courseCode: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', formData);
      setCourses([res.data, ...courses]);
      setFormData({ courseName: '', courseCode: '' }); // Clear form
    } catch (err) {
      console.error("Failed to add course", err);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(course => course._id !== id));
        } catch (err) {
            console.error("Failed to delete course", err);
        }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1>Manage Courses</h1>
        
        {/* Add Course Form */}
        <div className="list-container add-form">
            <h2>Add New Course</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="courseName" value={formData.courseName} onChange={onChange} placeholder="Course Name" required />
                <input type="text" name="courseCode" value={formData.courseCode} onChange={onChange} placeholder="Course Code (e.g., CS101)" required />
                <button type="submit">Add Course</button>
            </form>
        </div>

        {/* Courses List */}
        <div className="list-container">
            <h2>Existing Courses</h2>
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="search-bar"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => (
                  <tr key={course._id}>
                    <td>{course.courseName}</td>
                    <td>{course.courseCode}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteCourse(course._id)}>Delete</button>
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

export default CoursesPage;