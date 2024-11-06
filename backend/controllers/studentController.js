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

exports.getStudentAnswers = (req, res) => {
  const { assignmentID, studentUsername } = req.params;
  
  if (!assignmentID || !studentUsername) {
    return res.status(400).json({ message: 'Assignment ID and Student Username are required.' });
  }

  const query = `
    SELECT q.questionID, q.questionText, q.questionType, q.questionOptions, 
           IFNULL(a.studentAnswer, NULL) AS studentAnswer, 
           IFNULL(a.ratingValue, NULL) AS ratingValue,
           ass.assignmentTitle,
           sub.status, sub.last_saved_at, sub.submitted_at
    FROM questions q
    LEFT JOIN answers a ON q.questionID = a.questionID AND a.studentUsername = ?
    INNER JOIN assignments ass ON q.assignmentID = ass.assignmentID
    LEFT JOIN student_submission sub ON sub.assignmentID = ass.assignmentID AND sub.studentUsername = ?
    WHERE q.assignmentID = ?
  `;

  db.query(query, [studentUsername, studentUsername, assignmentID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No questions found for this assignment.' });
    }

    const assignmentTitle = results[0].assignmentTitle;
    const status = results[0].status || 'in_progress'; // Default to 'in_progress' if no status is found
    const lastSavedAt = results[0].last_saved_at || null;
    console.log(new Date(lastSavedAt).toLocaleString());
    const submittedAt = results[0].submitted_at || null; // Might be null if not submitted

    const questions = results.map((row) => ({
      questionID: row.questionID,
      questionText: row.questionText,
      questionType: row.questionType,
      questionOptions: row.questionOptions || null, 
      studentAnswer: row.studentAnswer || null,
      ratingValue: row.ratingValue || null
    }));

    res.status(200).json({ assignmentTitle, status, lastSavedAt, submittedAt, questions });

  });
};

exports.saveStudentAnswers = (req, res) => {
  const { assignmentID, studentUsername, answers } = req.body;
  console.log(req.body);

  
  if (!assignmentID || !studentUsername || !answers) {
    return res.status(400).json({ message: 'Assignment ID, Student Username, and Answers are required.' });
  }

  const answerEntries = Object.entries(answers);

  const queries = answerEntries.map(([questionID, answer]) => {
    const query = `
      INSERT INTO answers (questionID, studentUsername, studentAnswer)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE studentAnswer = VALUES(studentAnswer)
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [questionID, studentUsername, JSON.stringify(answer)], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  const submissionQuery = `
    INSERT INTO student_submission (assignmentID, studentUsername, status)
    VALUES (?, ?, 'in_progress')
    ON DUPLICATE KEY UPDATE status = 'in_progress', last_saved_at = CURRENT_TIMESTAMP
  `;

  const submissionPromise = new Promise((resolve, reject) => {
    db.query(submissionQuery, [assignmentID, studentUsername], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  Promise.all([...queries, submissionPromise])
    .then(() => {
      res.status(200).json({ message: 'Answers saved successfully' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Database error', error: err });
    });
};

exports.submitStudentAnswers = (req, res) => {
  const { assignmentID, studentUsername, answers } = req.body;

  if (!assignmentID || !studentUsername || !answers) {
    return res.status(400).json({ message: 'Assignment ID, Student Username, and Answers are required.' });
  }

  const answerEntries = Object.entries(answers);

  const queries = answerEntries.map(([questionID, answer]) => {
    const query = `
      INSERT INTO answers (questionID, studentUsername, studentAnswer)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE studentAnswer = VALUES(studentAnswer)
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [questionID, studentUsername, JSON.stringify(answer)], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  const updateSubmissionQuery = `
    INSERT INTO student_submission (assignmentID, studentUsername, status, submitted_at)
    VALUES (?, ?, 'submitted', NOW())
    ON DUPLICATE KEY UPDATE status = 'submitted', submitted_at = NOW()
  `;

  Promise.all(queries)
    .then(() => {
      return new Promise((resolve, reject) => {
        db.query(updateSubmissionQuery, [assignmentID, studentUsername], (err, result) => {
          if (err) {
            console.error('Database error during submission:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    })
    .then(() => {
      res.status(200).json({ message: 'Assignment submitted successfully' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Database error during submission', error: err });
    });
};

exports.fetchAssignments = (req, res) => {
  const { studentUsername, courseID, semester, sectionID } = req.params;

  if (!studentUsername || !courseID || !semester || !sectionID) {
    return res.status(400).json({ message: 'All parameters (studentUsername, courseID, semester, sectionID) are required.' });
  }

  const query = `
    SELECT 
      a.assignmentID, 
      a.assignmentTitle, 
      a.dueDateTime, 
      COALESCE(ss.status, 'not_attempted') AS status -- Default to 'not_attempted' if no submission is found
    FROM assignments a
    LEFT JOIN student_submission ss 
      ON a.assignmentID = ss.assignmentID 
      AND ss.studentUsername = ?
    WHERE a.courseID = ? 
      AND a.semester = ? 
      AND a.sectionID = ?
  `;

  db.query(query, [studentUsername, courseID, semester, sectionID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this section.' });
    }

    res.status(200).json({ assignments: results });
  });
};

exports.joinGroup = (req, res) => {
  const { studentUsername, groupID, courseID, sectionID, semester } = req.body;

  if (!studentUsername || !groupID || !courseID || !sectionID || !semester) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const checkQuery = `
    SELECT groupID 
    FROM enrollments 
    WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?
  `;

  db.query(checkQuery, [studentUsername, courseID, sectionID, semester], (err, results) => {
    if (err) {
      console.error('Error checking student enrollment:', err);
      return res.status(500).json({ message: 'Error checking enrollment', error: err });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE enrollments 
        SET groupID = ? 
        WHERE studentUsername = ? AND courseID = ? AND sectionID = ? AND semester = ?
      `;

      db.query(updateQuery, [groupID, studentUsername, courseID, sectionID, semester], (err, result) => {
        if (err) {
          console.error('Error updating student group:', err);
          return res.status(500).json({ message: 'Error updating group', error: err });
        }

        return res.status(200).json({ message: 'Student group updated successfully!' });
      });
    } else {
      const insertQuery = `
        INSERT INTO enrollments (studentUsername, courseID, sectionID, semester, groupID)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(insertQuery, [studentUsername, courseID, sectionID, semester, groupID], (err, result) => {
        if (err) {
          console.error('Error adding student to group:', err);
          return res.status(500).json({ message: 'Error adding student to group', error: err });
        }

        res.status(201).json({ message: 'Student added to group successfully!' });
      });
    }
  });
};