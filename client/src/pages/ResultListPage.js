import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../services/api';
import generateResultPDF from '../utils/generatePDF'; // <-- IMPORT THE NEW UTILITY
import './ListPage.css';

const ResultListPage = () => {
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null); // To show loading state

    useEffect(() => {
        const fetchCompletedCourses = async () => {
            try {
                const res = await api.get('/courses/view/completed');
                setCompletedCourses(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompletedCourses();
    }, []);

    // --- NEW FUNCTION to handle the download ---
    const handleDownload = async (course) => {
        setDownloadingId(course._id);
        try {
            // Fetch the detailed enrollments for this specific course
            const enrollmentsRes = await api.get(`/enrollments/course/${course._id}`);
            // Generate the PDF with the course info and the fetched enrollments
            generateResultPDF(course, enrollmentsRes.data);
        } catch (err) {
            console.error("Failed to generate PDF", err);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="list-page-header">
                    <h1>Completed Courses (Results)</h1>
                </div>
                <div className="list-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Code</th>
                                <th>Completion Date</th>
                                <th>Download Result</th>{/* <-- NEW COLUMN HEADER */}
                            </tr>
                        </thead>
                        <tbody>
                            {completedCourses.length > 0 ? completedCourses.map(course => (
                                <tr key={course._id}>
                                    <td>
                                        <Link to={`/results/${course._id}`} className="profile-link">
                                            {course.courseName}
                                        </Link>
                                    </td>
                                    <td>{course.courseCode}</td>
                                    <td>{new Date(course.updatedAt).toLocaleDateString()}</td>
                                    {/* --- NEW COLUMN DATA --- */}
                                    <td>
                                        <button 
                                            onClick={() => handleDownload(course)} 
                                            className="action-buttons" 
                                            title="Download PDF"
                                            disabled={downloadingId === course._id}
                                        >
                                            {downloadingId === course._id ? '...' : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4">No completed courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ResultListPage;