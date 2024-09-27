const db = require('../db');

// Create or update a course and add new teachings
exports.createCourse = (req, res) => {
  const { courseID, courseTitle, courseDescription, courseType, teacherUsername, semester, sections } = req.body;

  // Validate input
  if (!courseID || !courseTitle || !courseDescription || !courseType || !teacherUsername || !semester || !sections || sections.length === 0) {
    return res.status(400).json({ message: 'Course ID, title, description, type, teacher, semester, and sections are required.' });
  }

  console.log(`courseID: ${courseID}, courseTitle: ${courseTitle}, courseDescription: ${courseDescription}`);

  // Check if the teacher exists
  db.query('SELECT * FROM users WHERE username = ? AND accountType = "teacher"', [teacherUsername], (err, results) => {
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

      // Check if the course already exists
      db.query(
        'SELECT * FROM courses WHERE courseID = ? AND semester = ?',
        [courseID, semester],
        (err, courseResults) => {
          if (err) {
            db.query('ROLLBACK', () => {}); // Rollback transaction
            return res.status(500).json({ message: 'Error checking course', error: err });
          }

          if (courseResults.length === 0) {
            // Course does not exist, insert the course
            db.query(
              'INSERT INTO courses (courseID, courseTitle, courseDescription, courseType, semester) VALUES (?, ?, ?, ?, ?)',
              [courseID, courseTitle, courseDescription, courseType, semester],
              (err) => {
                if (err) {
                  db.query('ROLLBACK', () => {}); // Rollback transaction
                  return res.status(500).json({ message: 'Error creating course', error: err });
                }
                insertSectionsAndTeachings(req, res, courseID, semester, sections, teacherUsername);
              }
            );
          } else {
            // Course exists, only insert new sections and teachings
            insertSectionsAndTeachings(req, res, courseID, semester, sections, teacherUsername);
          }
        }
      );
    });
  });
};

// Helper function to insert sections and teachings
const insertSectionsAndTeachings = (req, res, courseID, semester, sections, teacherUsername) => {
  let sectionCount = 0;

  sections.forEach((section) => {
    const { sectionID, sectionDescription } = section;

    // Check if section already exists
    db.query(
      'SELECT * FROM sections WHERE courseID = ? AND sectionID = ? AND semester = ?',
      [courseID, sectionID, semester],
      (err, sectionResults) => {
        if (err) {
          db.query('ROLLBACK', () => {}); // Rollback transaction
          return res.status(500).json({ message: 'Error checking section', error: err });
        }

        if (sectionResults.length === 0) {
          // Section does not exist, insert a new section
          db.query(
            'INSERT INTO sections (sectionID, sectionDescription, courseID, semester) VALUES (?, ?, ?, ?)',
            [sectionID, sectionDescription, courseID, semester],
            (err) => {
              if (err) {
                db.query('ROLLBACK', () => {}); // Rollback transaction
                return res.status(500).json({ message: 'Error creating section', error: err });
              }
              // Insert teaching after creating a section
              insertTeaching(req, res, teacherUsername, courseID, sectionID, semester, sections.length, ++sectionCount);
            }
          );
        } else {
          // Section exists, only insert teaching
          insertTeaching(req, res, teacherUsername, courseID, sectionID, semester, sections.length, ++sectionCount);
        }
      }
    );
  });
};

// Helper function to insert teaching and commit transaction if all sections processed
const insertTeaching = (req, res, teacherUsername, courseID, sectionID, semester, totalSections, sectionCount) => {
  // Check if teaching already exists
  db.query(
    'SELECT * FROM teachings WHERE teacherUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?',
    [teacherUsername, courseID, sectionID, semester],
    (err, teachingResults) => {
      if (err) {
        db.query('ROLLBACK', () => {}); // Rollback transaction
        return res.status(500).json({ message: 'Error checking teaching', error: err });
      }

      if (teachingResults.length === 0) {
        // Teaching does not exist, insert new teaching
        db.query(
          'INSERT INTO teachings (teacherUsername, courseID, sectionID, semester) VALUES (?, ?, ?, ?)',
          [teacherUsername, courseID, sectionID, semester],
          (err) => {
            if (err) {
              db.query('ROLLBACK', () => {}); // Rollback transaction
              return res.status(500).json({ message: 'Error inserting into teachings', error: err });
            }

            // Commit the transaction if all sections and teachings are processed
            if (sectionCount === totalSections) {
              db.query('COMMIT', (err) => {
                if (err) {
                  return res.status(500).json({ message: 'Error committing transaction', error: err });
                }
                res.status(201).json({ message: 'Course, sections, and teachings processed successfully!' });
              });
            }
          }
        );
      } else {
        // Teaching exists, proceed to next section
        if (sectionCount === totalSections) {
          db.query('COMMIT', (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error committing transaction', error: err });
            }
            res.status(201).json({ message: 'Course, sections, and teachings processed successfully!' });
          });
        }
      }
    }
  );
};
