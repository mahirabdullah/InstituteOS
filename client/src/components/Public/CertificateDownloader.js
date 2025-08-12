import React, { useState } from 'react';

const CertificateDownloader = () => {
    const [studentId, setStudentId] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [message, setMessage] = useState('');

    const handleDownload = (e) => {
        e.preventDefault();
        if (studentId && courseCode) {
            // In a real app, you would make an API call to verify the details
            // and then trigger a download.
            setMessage(`Certificate for Student ID: ${studentId} and Course: ${courseCode} would be generated and downloaded here.`);
        } else {
            setMessage('Please enter both Student ID and Course Code.');
        }
    };

    return (
        <div>
            <h2>Download Certificate</h2>
            <p>A public page where a student can enter their details to get a certificate.</p>
            <form onSubmit={handleDownload}>
                <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID"
                    required
                />
                <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="Enter Course Code"
                    required
                />
                <button type="submit">Generate</button>
            </form>
            {message && <p style={{ marginTop: '20px' }}>{message}</p>}
        </div>
    );
};

export default CertificateDownloader;