const db = require('../db');

// Create or update a course and add new teachings
exports.teachNewCourse = (req, res) => {
  const { courseID, courseTitle, courseDescription, courseType, teacherUsername, semester, sections } = req.body;
  console.log(req.body);
  // Validate input
  if (!courseID || !courseTitle || !courseDescription || !courseType || !teacherUsername || !semester || !sections || sections.length === 0) {
    return res.status(400).json({ message: 'Course ID, title, description, type, teacher, semester, and sections are required.' });
  }

  // console.log(`${courseID}, ${courseTitle}, ${courseDescription}, ${courseType}, ${teacherUsername}, ${semester}, ${sections}`);

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
                  console.log(err);
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


exports.getCoursesByTeacher = (req, res) => {
  const { teacherUsername } = req.params;

  if (!teacherUsername) {
    return res.status(400).json({ message: 'Teacher username is required.' });
  }
  console.log(teacherUsername);

  db.query(
    `SELECT DISTINCT c.courseID, c.courseTitle, c.courseDescription, c.courseType, c.semester 
     FROM courses c
     JOIN teachings t ON c.courseID = t.courseID AND c.semester = t.semester
     WHERE t.teacherUsername = ?`,
    [teacherUsername],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No courses found for this teacher.' });
      }

      res.status(200).json({ courses: results });
    }
  );
};

exports.getGrades = (req, res) => {
  const { assignmentID } = req.params;

  const query = `
    SELECT 
      s.studentUsername,
      CONCAT(u.firstName, ' ', u.lastName) AS studentName,
      s.score,
      s.published,
      g.goalText
    FROM scores s
    JOIN users u ON s.studentUsername = u.username
    LEFT JOIN goals g ON s.assignmentID = g.assignmentID AND s.studentUsername = g.studentUsername
    WHERE s.assignmentID = ?
  `;

  db.query(query, [assignmentID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const response = results.map((row) => ({
      studentUsername: row.studentUsername,
      studentName: row.studentName,
      score: row.published && row.score !== null ? parseFloat(row.score).toFixed(2) : 'Not available',
      goal: row.goalText || 'No goal set',
    }));

    res.status(200).json({ ratings: response });
  });
};

exports.publishGrades = async (req, res) => {
  const { assignmentID } = req.body;
  console.log(req.body);

  const query = `
    INSERT INTO scores (assignmentID, studentUsername, score, published, finalizedAt)
    SELECT 
      sub.assignmentID,
      sub.evaluateeUsername AS studentUsername,
      AVG(ans.studentAnswer) AS score,
      TRUE AS published,
      NOW() AS finalizedAt
    FROM student_submission sub
    JOIN answers ans ON sub.submissionID = ans.submissionID
    JOIN questions q ON ans.questionID = q.questionID
    WHERE q.questionType = 'goal'
      AND sub.assignmentID = ?
      AND sub.status = 'submitted'
    GROUP BY sub.evaluateeUsername
    ON DUPLICATE KEY UPDATE 
      score = VALUES(score),
      published = TRUE,
      finalizedAt = NOW();
  `;


  db.query(query, [assignmentID], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Scores published successfully' });
  });
};

exports.checkGradesPublished = (req, res) => {
  const { assignmentID } = req.params;

  if (!assignmentID) {
    return res.status(400).json({ message: 'Assignment ID is required.' });
  }

  const query = `
    SELECT published
    FROM scores
    WHERE assignmentID = ?
    LIMIT 1
  `;

  db.query(query, [assignmentID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(200).json({ gradesPublished: false });
    }

    const gradesPublished = results[0].published === 1;
    return res.status(200).json({ gradesPublished });
  });
};

exports.setAllowGroupChange = (req, res) => {
  const { courseID, sectionID, semester, allowGroupChange } = req.body;

  if (!courseID || !sectionID || !semester || typeof allowGroupChange !== 'boolean') {
    return res.status(400).json({ message: 'Course ID, Section ID, Semester, and Allow Group Change are required.' });
  }

  const query = `
    UPDATE sections
    SET allowGroupChange = ?
    WHERE courseID = ? AND sectionID = ? AND semester = ?
  `;

  db.query(query, [allowGroupChange, courseID, sectionID, semester], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Allow Group Change setting updated successfully.' });
    } else {
      res.status(404).json({ message: 'Section not found.' });
    }
  });
};

exports.getAllowGroupChangeStatus = (req, res) => {
  const { courseID, sectionID, semester } = req.params;

  if (!courseID || !sectionID || !semester) {
    return res.status(400).json({ message: 'Course ID, Section ID, and Semester are required.' });
  }

  const query = `
    SELECT allowGroupChange
    FROM sections
    WHERE courseID = ? AND sectionID = ? AND semester = ?
  `;

  db.query(query, [courseID, sectionID, semester], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    res.status(200).json({ allowGroupChange: results[0].allowGroupChange });
  });
};

exports.removeStudentFromGroup = (req, res) => {
  const { studentUsername, courseID, sectionID, semester } = req.body;

  if (!studentUsername || !courseID || !sectionID || !semester) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const checkEnrollmentQuery = `
    SELECT groupID
    FROM enrollments
    WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?
  `;

  db.query(checkEnrollmentQuery, [studentUsername, courseID, sectionID, semester], (err, results) => {
    if (err) {
      console.error('Error checking student enrollment:', err);
      return res.status(500).json({ message: 'Error checking student enrollment', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found in the specified course, section, or semester.' });
    }

    const updateGroupQuery = `
      UPDATE enrollments
      SET groupID = NULL
      WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?
    `;

    db.query(updateGroupQuery, [studentUsername, courseID, sectionID, semester], (err, result) => {
      if (err) {
        console.error('Error removing student from group:', err);
        return res.status(500).json({ message: 'Error removing student from group', error: err });
      }

      res.status(200).json({ message: 'Student successfully removed from group.' });
    });
  });
};