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
  console.log(`assignmentID: ${assignmentID}, studentUsername: ${studentUsername}`);
  
  if (!assignmentID || !studentUsername) {
    return res.status(400).json({ message: 'Assignment ID and Student Username are required.' });
  }

  const query = `
    SELECT q.questionID, q.questionText, q.questionType, q.questionOptions, 
           IFNULL(a.studentAnswer, NULL) AS studentAnswer, 
           IFNULL(a.ratingValue, NULL) AS ratingValue,
           ass.assignmentTitle
    FROM questions q
    LEFT JOIN answers a ON q.questionID = a.questionID AND a.studentUsername = ?
    INNER JOIN assignments ass ON q.assignmentID = ass.assignmentID
    WHERE q.assignmentID = ?
  `;

  db.query(query, [studentUsername, assignmentID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No questions found for this assignment.' });
    }

    const assignmentTitle = results[0].assignmentTitle;

    const questions = results.map((row) => ({
      questionID: row.questionID,
      questionText: row.questionText,
      questionType: row.questionType,
      questionOptions: row.questionOptions || null, 
      studentAnswer: row.studentAnswer || null,
      ratingValue: row.ratingValue || null
    }));

    res.status(200).json({ assignmentTitle, questions });
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
