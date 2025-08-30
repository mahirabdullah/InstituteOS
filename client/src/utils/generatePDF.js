// C:\Users\MAHIR\Projects\sms\client\src\utils\generatePDF.js

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const generateResultPDF = (course, enrollments) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(`Results for ${course.courseName}`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Code: ${course.courseCode}`, 14, 30);

  const tableColumn = ["Student Name", "Marks", "Grade", "CGPA", "Remarks"];
  
  const tableRows = [];
  enrollments.forEach(enrollment => {
    const resultData = [
      enrollment.student.name,
      enrollment.marks,
      enrollment.letterGrade,
      enrollment.gradePoint ? enrollment.gradePoint.toFixed(1) : 'N/A',
      enrollment.remarks,
    ];
    tableRows.push(resultData);
  });

  // <-- 2. FUNCTION CALL CHANGE
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
  });

  doc.save(`Results-${course.courseCode}-${course.courseName}.pdf`);
};

export default generateResultPDF;