import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './ListPage.css';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) { console.error("Failed to fetch students", err); }
    };
    fetchStudents();
  }, []);

  const { name, email } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (student) => {
    setEditingItem(student);
    setFormData({ name: student.name, email: student.email });
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingItem(null);
    setFormData({ name: '', email: '' });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (editingItem) {
      try {
        const res = await api.put(`/students/${editingItem._id}`, formData);
        setStudents(students.map(student => (student._id === editingItem._id ? res.data : student)));
        alert('Student updated successfully!'); // <-- SUCCESS MESSAGE
        handleCancel();
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to update student";
        alert(errorMsg);
        console.error(err);
      }
    } else {
      try {
        const res = await api.post('/students', formData);
        setStudents([res.data, ...students]);
        alert('Student saved successfully!'); // <-- SUCCESS MESSAGE
        handleCancel();
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to add student";
        alert(errorMsg);
        console.error(err);
      }
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        try {
            await api.delete(`/students/${id}`);
            setStudents(students.filter(student => student._id !== id));
            alert('Student deleted successfully!'); // <-- SUCCESS MESSAGE
        } catch (err) { 
            alert('Failed to delete student.');
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
        <div className="list-page-header">
          <h1>Manage Students</h1>
          <button onClick={() => { isFormVisible ? handleCancel() : setIsFormVisible(true) }} className="add-button">
            {isFormVisible ? 'Cancel' : '+ Add Student'}
          </button>
        </div>

        {isFormVisible && (
          <div className="list-container" style={{marginBottom: '20px'}}>
              <h2 style={{marginTop: 0, fontWeight: 500}}>{editingItem ? 'Edit Student' : 'Add New Student'}</h2>
              <form onSubmit={onSubmit} className="add-item-form">
                <div className="form-grid">
                  <div className="form-control">
                    <label htmlFor="name">Student Name</label>
                    <input id="name" type="text" name="name" value={name} onChange={onChange} required />
                  </div>
                  <div className="form-control">
                    <label htmlFor="email">Student Email</label>
                    <input id="email" type="email" name="email" value={email} onChange={onChange} required />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit">{editingItem ? 'Update Student' : 'Save Student'}</button>
                </div>
              </form>
          </div>
        )}

        <div className="list-container">
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
                <th>Active Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>
                    <Link to={`/student/${student._id}`} className="profile-link">
                      {student.name}
                    </Link>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.courses.filter(c => c.status === 'Active').length}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditClick(student)} title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => deleteStudent(student._id)} title="Delete">
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

export default StudentsPage;