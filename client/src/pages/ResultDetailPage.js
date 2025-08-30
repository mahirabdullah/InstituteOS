import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import './CourseDetailPage.css';

const ResultDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, enrollmentsRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    api.get(`/enrollments/course/${id}`)
                ]);
                setCourse(courseRes.data);
                setEnrollments(enrollmentsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="dashboard-container"><Sidebar /><main className="main-content">Loading...</main></div>;
    if (!course) return <div className="dashboard-container"><Sidebar /><main className="main-content">Result not found.</main></div>;

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <Link to="/results" className="back-link">← Back to Results</Link>
                <h1>Results for {course.courseName}</h1>
                <p className="course-code">Code: {course.courseCode}</p>

                <div className="list-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Marks</th>
                                <th>Grade</th>
                                <th>CGPA</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map(e => (
                                <tr key={e._id}>
                                    <td>{e.student.name}</td>
                                    <td>{e.marks}</td>
                                    <td>{e.letterGrade}</td>
                                    <td>{e.gradePoint ? e.gradePoint.toFixed(1) : 'N/A'}</td>
                                    <td>{e.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ResultDetailPage;