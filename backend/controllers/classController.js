const db = require('../db');

// Get all sections for a specific courseID and semester
exports.getSectionsByCourse = (req, res) => {
  const { courseID, semester } = req.params;

  if (!courseID || !semester) {
    return res.status(400).json({ message: 'Course ID and semester are required.' });
  }

  db.query(
    `SELECT sectionID, sectionDescription 
     FROM sections 
     WHERE courseID = ? AND semester = ?`,
    [courseID, semester],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No sections found for this course and semester.' });
      }

      res.status(200).json({ sections: results });
    }
  );
};

// Get section details for a specific courseID, semester, and sectionID
exports.getSectionDetails = (req, res) => {
  const { courseID, semester, sectionID } = req.params;

  if (!courseID || !semester || !sectionID) {
    return res.status(400).json({ message: 'courseID, semester, and sectionID are required.' });
  }

  const query = `
    SELECT c.courseDescription, s.sectionDescription 
    FROM courses c
    JOIN sections s ON c.courseID = s.courseID AND c.semester = s.semester
    WHERE c.courseID = ? AND c.semester = ? AND s.sectionID = ?
  `;

  db.query(query, [courseID, semester, sectionID], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No course or section found for the provided courseID, semester, and sectionID.' });
    }

    const { courseDescription, sectionDescription } = results[0];
    res.status(200).json({ courseDescription, sectionDescription });
  });
};

exports.getEnrolledStudents = (req, res) => {
  const { courseID, semester, sectionID } = req.params;

  if (!courseID || !semester || !sectionID) {
    return res.status(400).json({ message: 'Course ID, semester, and section ID are required.' });
  }

  const query = `
    SELECT u.username, u.firstName, u.lastName 
    FROM enrollments e
    JOIN users u ON e.studentUsername = u.username
    WHERE e.courseID = ? AND e.semester = ? AND e.sectionID = ?
  `;

  db.query(query, [courseID, semester, sectionID], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No students found for this course section.' });
    }

    res.status(200).json({ students: results });
  });
};

exports.addEnrollment = (req, res) => {
  const { courseID, semester, sectionID, studentUsername } = req.body;
  
  if (!courseID || !semester || !sectionID || !studentUsername) {
    return res.status(400).json({ message: 'Course ID, semester, section ID, and student username are required.' });
  }

  db.query('SELECT accountType, firstName, lastName FROM users WHERE username = ?', [studentUsername], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const { accountType, firstName, lastName } = results[0];
    if (accountType !== 'student') {
      return res.status(400).json({ message: 'User is not a student.' });
    }

    db.query(
      'SELECT * FROM enrollments WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?',
      [studentUsername, courseID, sectionID, semester],
      (err, enrollmentResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (enrollmentResults.length > 0) {
          return res.status(400).json({ message: 'Student is already enrolled in this course section.' });
        }

        db.query(
          'INSERT INTO enrollments (studentUsername, courseID, sectionID, semester) VALUES (?, ?, ?, ?)',
          [studentUsername, courseID, sectionID, semester],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error adding enrollment', error: err });
            }

            // Return full student details in the response
            res.status(201).json({
              message: 'Enrollment added successfully!',
              student: {
                username: studentUsername,
                firstName,
                lastName
              }
            });
          }
        );
      }
    );
  });
};

exports.removeEnrollment = (req, res) => {
    const { courseID, semester, sectionID, studentUsername } = req.body;
    
    if (!courseID || !semester || !sectionID || !studentUsername) {
      return res.status(400).json({ message: 'Course ID, semester, section ID, and student username are required.' });
    }
  
    db.query(
      'SELECT * FROM enrollments WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?',
      [studentUsername, courseID, sectionID, semester],
      (err, enrollmentResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
  
        if (enrollmentResults.length === 0) {
          return res.status(404).json({ message: 'Enrollment not found.' });
        }
  
        // Proceed to remove the enrollment
        db.query(
          'DELETE FROM enrollments WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?',
          [studentUsername, courseID, sectionID, semester],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error removing enrollment', error: err });
            }
  
            res.status(200).json({ message: 'Enrollment removed successfully!' });
          }
        );
      }
    );
  };
