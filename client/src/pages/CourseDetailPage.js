import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourseData = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to fetch course data", err);
    }
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCourseData(),
          api.get('/teachers').then(res => setAllTeachers(res.data)),
          api.get('/students').then(res => setAllStudents(res.data)),
        ]);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);
  
  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return alert('Please select a teacher.');
    try {
        const res = await api.post(`/courses/${id}/assign-teacher`, { teacherId: selectedTeacher });
        setCourse(prevCourse => ({...prevCourse, teachers: res.data}));
        setSelectedTeacher('');
    } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to assign teacher.";
        alert(errorMsg);
        console.error(err);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert('Please select a student.');
    try {
        const res = await api.post(`/courses/${id}/enroll-student`, { studentId: selectedStudent });
        setCourse(prevCourse => ({...prevCourse, students: res.data}));
        setSelectedStudent('');
    } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to enroll student.";
        alert(errorMsg);
        console.error(err);
    }
  };
  
  if (loading) return <div className="dashboard-container"><Sidebar /><main className="main-content">Loading...</main></div>;
  if (!course) return <div className="dashboard-container"><Sidebar /><main className="main-content">Course not found.</main></div>;
  
  const availableTeachers = allTeachers.filter(t => !course.teachers.some(ct => ct._id === t._id));
  const availableStudents = allStudents.filter(s => !course.students.some(cs => cs._id === s._id));

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
              {course.teachers.map(teacher => <li key={teacher._id}>{teacher.name}</li>)}
              {course.teachers.length === 0 && <p>No teachers assigned yet.</p>}
            </ul>
            {course.teachers.length < 2 ? (
              <form onSubmit={handleAssignTeacher} className="add-item-form">
                <div className="form-control">
                  <label>Assign a new teacher</label>
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
            <h2>Manage Students ({course.students.length}/30)</h2>
             <ul className="item-list">
              {course.students.map(student => <li key={student._id}>{student.name}</li>)}
              {course.students.length === 0 && <p>No students enrolled yet.</p>}
            </ul>
            {course.students.length < 30 ? (
              <form onSubmit={handleEnrollStudent} className="add-item-form">
                <div className="form-control">
                  <label>Enroll a new student</label>
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
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;