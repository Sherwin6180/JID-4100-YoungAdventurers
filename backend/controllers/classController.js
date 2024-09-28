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