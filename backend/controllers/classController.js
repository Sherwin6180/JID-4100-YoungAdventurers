const db = require('../db');

// Get all sections for a specific courseID and semester
exports.getSectionsByCourse = (req, res) => {
  const { courseID, semester } = req.params;

  if (!courseID || !semester) {
    return res.status(400).json({ message: 'Course ID and semester are required.' });
  }
  console.log(`${courseID}, ${semester}`);

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
