const db = require('../db');

exports.getSectionsByStudent = (req, res) => {
  const { studentUsername } = req.params;
  if (!studentUsername) {
    return res.status(400).json({ message: 'Student username is required.' });
  }

  const query = `
    SELECT s.sectionID, s.sectionDescription, c.courseID, c.courseTitle, c.courseDescription, c.semester, c.courseType, e.enrolled_at
    FROM sections s
    INNER JOIN courses c ON s.courseID = c.courseID AND s.semester = c.semester
    INNER JOIN enrollments e ON s.sectionID = e.sectionID AND s.courseID = e.courseID AND s.semester = e.semester
    WHERE e.studentUsername = ?
  `;

  db.query(query, [studentUsername], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No sections found for this student.' });
    }

    res.status(200).json({ sections: results });
  });
};
