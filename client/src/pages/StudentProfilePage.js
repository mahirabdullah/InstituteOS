import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './TeacherProfilePage.css'; // Reusing the teacher's profile CSS for consistency

const StudentProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${id}/profile`);
        setStudent(res.data.student);
        setEnrollments(res.data.enrollments);
      } catch (err) {
        console.error("Failed to fetch student data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">Loading...</main>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <h1>Student Not Found</h1>
          <p>The student you are looking for does not exist.</p>
          <Link to="/students" className="back-link">← Go back to Students</Link>
        </main>
      </div>
    );
  }

  const activeEnrollments = enrollments.filter(e => e.course?.status === 'Active');
  const completedEnrollments = enrollments.filter(e => e.course?.status === 'Completed');

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Link to="/students" className="back-link">← Back to Students</Link>
        <h1>{student.name}'s Profile</h1>
        <p className="teacher-email">{student.email}</p>
        
        <div className="list-container full-width">
            <h2>Active Courses</h2>
            {activeEnrollments.length > 0 ? (
                <ul>
                    {activeEnrollments.map(e => (
                        <li key={e._id}>{e.course.courseName} ({e.course.courseCode})</li>
                    ))}
                </ul>
            ) : (
                <p>Not currently enrolled in any active courses.</p>
            )}
        </div>

        <div className="list-container full-width" style={{marginTop: '30px'}}>
            <h2>Completed Courses & Results</h2>
            {completedEnrollments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Grade</th>
                            <th>CGPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedEnrollments.map(e => (
                            <tr key={e._id}>
                                <td>{e.course.courseName}</td>
                                <td>{e.letterGrade}</td>
                                <td>{e.gradePoint ? e.gradePoint.toFixed(1) : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No completed courses.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default StudentProfilePage;