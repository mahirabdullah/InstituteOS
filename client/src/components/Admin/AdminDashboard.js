import React, { useState } from 'react';

const StudentDirectory = () => {
    // 1. State for the list of students and form inputs
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // 2. Handler to add a new student
    const handleAddStudent = (e) => {
        // Prevents the page from reloading on form submission
        e.preventDefault(); 
        
        if (!name || !email) {
            alert('Please enter both name and email.');
            return;
        }

        const newStudent = {
            // Create a simple unique ID using the current time
            id: Date.now(), 
            name: name,
            email: email,
        };

        // Add the new student to the existing list
        setStudents([...students, newStudent]);

        // Clear the form inputs for the next entry
        setName('');
        setEmail('');
    };

    // 2. Handler to remove a student by their ID
    const handleRemoveStudent = (studentId) => {
        // Create a new list that excludes the student with the matching ID
        const updatedStudents = students.filter(student => student.id !== studentId);
        setStudents(updatedStudents);
    };

    // 3. The UI for displaying the list and the form
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Student Directory</h2>

            {/* Form for adding a new student */}
            <form onSubmit={handleAddStudent} style={{ margin: '20px 0' }}>
                <input 
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <input 
                    type="email"
                    placeholder="Student Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 12px' }}>
                    Add Student
                </button>
            </form>

            {/* List of current students */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {students.map(student => (
                    <li key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                        <div>
                            <strong>{student.name}</strong>
                            <br />
                            <small>{student.email}</small>
                        </div>
                        <button 
                            onClick={() => handleRemoveStudent(student.id)}
                            style={{ padding: '5px 10px', color: 'red', border: '1px solid red', background: 'none', cursor: 'pointer' }}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentDirectory;