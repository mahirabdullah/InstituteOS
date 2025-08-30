import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ courseName: '', courseCode: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) { console.error("Failed to fetch courses", err); }
    };
    fetchCourses();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleEditClick = (course) => {
    setEditingItem(course);
    setFormData({ courseName: course.courseName, courseCode: course.courseCode });
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingItem(null);
    setFormData({ courseName: '', courseCode: '' });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    if (editingItem) {
      try {
        const res = await api.put(`/courses/${editingItem._id}`, formData);
        setCourses(courses.map(course => (course._id === editingItem._id ? res.data : course)));
        alert('Course updated successfully!'); // <-- SUCCESS MESSAGE
        handleCancel();
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to update course";
        alert(errorMsg);
        console.error(err);
      }
    } else {
      try {
        const res = await api.post('/courses', formData);
        setCourses([res.data, ...courses]);
        alert('Course saved successfully!'); // <-- SUCCESS MESSAGE
        handleCancel();
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to add course";
        alert(errorMsg);
        console.error(err);
      }
    }
  };
  
  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(course => course._id !== id));
            alert('Course deleted successfully!'); // <-- SUCCESS MESSAGE
        } catch (err) { 
            alert('Failed to delete course.');
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
        <div className="list-page-header">
          <h1>Manage Courses</h1>
          <button onClick={() => { isFormVisible ? handleCancel() : setIsFormVisible(true) }} className="add-button">
            {isFormVisible ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        {isFormVisible && (
          <div className="list-container" style={{marginBottom: '20px'}}>
              <h2 style={{marginTop: 0, fontWeight: 500}}>{editingItem ? 'Edit Course' : 'Add New Course'}</h2>
              <form onSubmit={onSubmit} className="add-item-form">
                <div className="form-grid">
                  <div className="form-control">
                    <label htmlFor="courseName">Course Name</label>
                    <input id="courseName" type="text" name="courseName" value={formData.courseName} onChange={onChange} required />
                  </div>
                  <div className="form-control">
                    <label htmlFor="courseCode">Course Code</label>
                    <input id="courseCode" type="text" name="courseCode" value={formData.courseCode} onChange={onChange} required />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit">{editingItem ? 'Update Course' : 'Save Course'}</button>
                </div>
              </form>
          </div>
        )}

        <div className="list-container">
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
                  <td>
                    <Link to={`/course/${course._id}`} className="profile-link">
                      {course.courseName}
                    </Link>
                  </td>
                  <td>{course.courseCode}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditClick(course)} title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => deleteCourse(course._id)} title="Delete">
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

export default CoursesPage;