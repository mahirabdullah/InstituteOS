// C:\Users\MAHIR\Projects\sms\client\src\pages\CourseDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      
      const [courseRes, enrollmentsRes, studentsRes, teachersRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/enrollments/course/${id}`),
        api.get('/students'),
        api.get('/teachers')
      ]);
      setCourse(courseRes.data);
      setEnrollments(enrollmentsRes.data);
      setAllStudents(studentsRes.data);
      setAllTeachers(teachersRes.data);
    } catch (err) {
      console.error("Failed to fetch page data", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return alert('Please select a teacher.');
    try {
        const res = await api.post(`/courses/${id}/assign-teacher`, { teacherId: selectedTeacher });
        setCourse(prevCourse => ({...prevCourse, teachers: res.data}));
        setSelectedTeacher('');
    } catch (err) {
        alert(err.response?.data?.msg || "Failed to assign teacher.");
    }
  };

  const handleUnassignTeacher = async (teacherId) => {
    if (window.confirm('Are you sure you want to remove this teacher from the course?')) {
        try {
            const res = await api.post(`/courses/${id}/unassign-teacher`, { teacherId });
            setCourse(prevCourse => ({...prevCourse, teachers: res.data}));
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to unassign teacher.");
        }
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert('Please select a student.');
    try {
        await api.post(`/courses/${id}/enroll-student`, { studentId: selectedStudent });
        fetchData(); 
        setSelectedStudent('');
    } catch (err) {
        alert(err.response?.data?.msg || "Failed to enroll student.");
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
        try {
            const res = await api.post(`/courses/${id}/unenroll-student`, { studentId });
            setEnrollments(res.data);
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to unenroll student.");
        }
    }
  };

  const handleUpdateMarks = (enrollmentId, newMarks) => {
    const originalEnrollments = [...enrollments];
    const updatedEnrollments = enrollments.map(e => e._id === enrollmentId ? { ...e, marks: newMarks } : e);
    setEnrollments(updatedEnrollments);
    const update = async () => {
      try {
        await api.put(`/enrollments/${enrollmentId}/marks`, { marks: newMarks });
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to update marks.");
        setEnrollments(originalEnrollments);
      }
    };
    const timerId = setTimeout(() => { update(); }, 1000);
    return () => clearTimeout(timerId);
  };
  
  const handleCompleteCourse = async () => {
    if(window.confirm('Are you sure? This will calculate final grades and cannot be undone.')) {
      try {
        await api.put(`/courses/${id}/complete`);
        alert('Course has been marked as complete!');
        navigate('/results');
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to complete course.");
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">Loading...</main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <h1>Course Not Found</h1>
          <p>The course you are looking for does not exist.</p>
          <Link to="/courses" className="back-link">← Go back to Courses</Link>
        </main>
      </div>
    );
  }
  
  const availableTeachers = allTeachers.filter(t => !course.teachers.some(ct => ct._id === t._id));
  const availableStudents = allStudents.filter(s => !enrollments.some(e => e.student._id === s._id));

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/courses" className="back-link">← Back to Courses</Link>
        <h1>{course.courseName}</h1>
        <p className="course-code">Code: {course.courseCode}</p>

        <div className="detail-grid">
          <div className="list-container">
            <h2>Manage Teachers ({course.teachers.length}/2)</h2>
            <ul className="item-list">
              {course.teachers.map(teacher => (
                <li key={teacher._id}>
                  <span>{teacher.name}</span>
                  <button onClick={() => handleUnassignTeacher(teacher._id)} className="remove-btn" title="Un-assign Teacher">×</button>
                </li>
              ))}
              {course.teachers.length === 0 && <p>No teachers assigned.</p>}
            </ul>
            {course.teachers.length < 2 ? (
              <form onSubmit={handleAssignTeacher} className="add-item-form">
                <div className="form-control">
                  <label>Assign a teacher</label>
                  <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} required>
                    <option value="">-- Select a teacher --</option>
                    {availableTeachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit">Assign Teacher</button>
                </div>
              </form>
            ) : <p>This course has the maximum number of teachers.</p>}
          </div>

          <div className="list-container">
            <h2>Enroll Students ({enrollments.length}/30)</h2>
            {enrollments.length < 30 ? (
              <form onSubmit={handleEnrollStudent} className="add-item-form">
                  <div className="form-control">
                    <label>Enroll a student</label>
                    <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                        <option value="">-- Select a student --</option>
                        {availableStudents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit">Enroll Student</button>
                  </div>
              </form>
            ) : <p>This course is full.</p>}
          </div>
            
          <div className="list-container full-width">
              <h2>Manage Student Marks</h2>
              <table className="marks-table">
                  <thead>
                      <tr>
                          <th>Student Name</th>
                          <th>Marks (out of 100)</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {enrollments.map(enrollment => (
                          <tr key={enrollment._id}>
                              <td>{enrollment.student.name}</td>
                              <td>
                                  <input 
                                      type="number" 
                                      min="0"
                                      max="100"
                                      defaultValue={enrollment.marks} 
                                      onChange={(e) => handleUpdateMarks(enrollment._id, e.target.value)}
                                      className="marks-input"
                                  />
                              </td>
                              <td>
                                <button onClick={() => handleUnenrollStudent(enrollment.student._id)} className="remove-btn icon-btn" title="Un-enroll Student">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
        
        <div className="complete-course-section">
            <p>Once all marks are entered, you can finalize the results.</p>
            <button onClick={handleCompleteCourse} className="complete-button">
              Finalize and Complete Course
            </button>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;