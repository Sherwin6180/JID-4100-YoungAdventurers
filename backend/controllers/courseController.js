const db = require('../db');

// Create a new course
exports.createCourse = (req, res) => {
  const { courseID, courseTitle, courseDescription, courseType, teacherUsername, semester, sections } = req.body;

  // Validate input
  if (!courseID || !courseTitle || !courseDescription || !courseType || !teacherUsername || !semester || !sections || sections.length === 0) {
    return res.status(400).json({ message: 'Course ID, title, description, type, teacher, semester, and sections are required.' });
  }

  console.log(`courseID: ${courseID}, courseTitle: ${courseTitle}, courseDes: ${courseDescription}, `)

  // Check if the teacher exists
  db.query('SELECT * FROM users WHERE username = ?', [teacherUsername], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Teacher does not exist' });
    }

    // Start transaction
    db.query('START TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Transaction error', error: err });
      }

      // Insert into courses table
      db.query(
        'INSERT INTO courses (courseID, courseTitle, courseDescription, courseType, teacherUsername, semester) VALUES (?, ?, ?, ?, ?, ?)',
        [courseID, courseTitle, courseDescription, courseType, teacherUsername, semester],
        (err) => {
          if (err) {
            db.query('ROLLBACK', () => {}); // Rollback transaction
            return res.status(500).json({ message: 'Error creating course', error: err });
          }

          // Insert sections
          let sectionCount = 0;
          sections.forEach((section) => {
            const { sectionID, sectionDescription } = section;

            db.query(
              'INSERT INTO sections (sectionID, sectionDescription, courseID, semester) VALUES (?, ?, ?, ?)',
              [sectionID, sectionDescription, courseID, semester],
              (err) => {
                if (err) {
                  db.query('ROLLBACK', () => {}); // Rollback transaction
                  return res.status(500).json({ message: 'Error creating sections', error: err });
                }

                sectionCount += 1;
                // Commit the transaction if all sections are inserted
                if (sectionCount === sections.length) {
                  db.query('COMMIT', (err) => {
                    if (err) {
                      return res.status(500).json({ message: 'Error committing transaction', error: err });
                    }
                    res.status(201).json({ message: 'Course and sections created successfully!' });
                  });
                }
              }
            );
          });
        }
      );
    });
  });
};
