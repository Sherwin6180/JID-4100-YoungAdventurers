const db = require('../db');

exports.getCoursesByStudent = (req, res) => {
  const { studentUsername } = req.params;
  if (!studentUsername) {
    return res.status(400).json({ message: 'Student username is required.' });
  }

  const query = `
    SELECT c.courseID, c.courseTitle, c.courseDescription, c.semester, c.courseType, e.enrolled_at
    FROM courses c
    INNER JOIN enrollments e ON c.courseID = e.courseID
    WHERE e.studentUsername = ?
  `;

  db.query(query, [studentUsername], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No courses found for this student.' });
    }

    res.status(200).json({ courses: results });
  });
};
