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
  const { assignmentID, studentUsername, submissionID } = req.params;
  
  if (!assignmentID || !studentUsername || !submissionID) {
    return res.status(400).json({ message: 'Assignment ID, Student Username, and Submission ID are required.' });
  }

  const query = `
    SELECT DISTINCT q.questionID, q.questionText, q.questionType, q.questionOptions, 
           IFNULL(a.studentAnswer, NULL) AS studentAnswer, 
           IFNULL(a.ratingValue, NULL) AS ratingValue,
           ass.assignmentTitle,
           sub.status, sub.last_saved_at, sub.submitted_at,
           sub.evaluateeUsername
    FROM questions q
    LEFT JOIN answers a ON q.questionID = a.questionID AND a.submissionID = ?
    INNER JOIN assignments ass ON q.assignmentID = ass.assignmentID
    LEFT JOIN student_submission sub 
      ON sub.assignmentID = ass.assignmentID 
      AND sub.submissionID = ?
    WHERE q.assignmentID = ?
  `;

  db.query(query, [submissionID, submissionID, assignmentID], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No questions found for this assignment.' });
    }

    const assignmentTitle = results[0].assignmentTitle;
    const status = results[0].status || 'in_progress';
    const lastSavedAt = results[0].last_saved_at || null;
    const submittedAt = results[0].submitted_at || null;
    const evaluateeUsername = results[0].evaluateeUsername;

    // Process each question and add evaluatee's goal text for "goal" type questions
    const questions = await Promise.all(
      results.map(async (row) => {
        let questionText = row.questionText;
        if (row.questionType === 'goal') {
          // Fetch evaluatee's goal
          const goalQuery = `
            SELECT goalText 
            FROM goals 
            WHERE assignmentID = ? 
              AND studentUsername = ?
          `;

          const goalResult = await new Promise((resolve, reject) => {
            db.query(goalQuery, [assignmentID, evaluateeUsername], (goalErr, goalRows) => {
              if (goalErr) {
                console.error('Database error fetching goal:', goalErr);
                reject(goalErr);
              }
              resolve(goalRows);
            });
          });

          if (goalResult.length > 0) {
            questionText += `\n\n${goalResult[0].goalText}`;
          } else {
            questionText += `\n\nThe student hasn't set the goal yet. Please come back later.`;
          }
        }

        return {
          questionID: row.questionID,
          questionText: questionText,
          questionType: row.questionType,
          questionOptions: row.questionOptions || null, 
          studentAnswer: row.studentAnswer || null,
          ratingValue: row.ratingValue || null
        };
      })
    );

    res.status(200).json({ assignmentTitle, status, lastSavedAt, submittedAt, questions });
  });
};


exports.saveStudentAnswers = (req, res) => {
  const { submissionID, answers } = req.body;
  console.log(req.body);

  if (!submissionID || !answers) {
    return res.status(400).json({ message: 'Submission ID and Answers are required.' });
  }

  const answerEntries = Object.entries(answers);

  // Prepare queries to insert or update each answer
  const queries = answerEntries.map(([questionID, answer]) => {
    const query = `
      INSERT INTO answers (submissionID, questionID, studentAnswer)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE studentAnswer = VALUES(studentAnswer)
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [submissionID, questionID, JSON.stringify(answer)], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Execute all answer queries
  Promise.all(queries)
    .then(() => {
      res.status(200).json({ message: 'Answers saved successfully' });
    })
    .catch((err) => {
      console.error('Error saving answers:', err);
      res.status(500).json({ message: 'Database error', error: err });
    });
};

exports.submitStudentAnswers = (req, res) => {
  const { submissionID, answers } = req.body;

  if (!submissionID || !answers) {
    return res.status(400).json({ message: 'Submission ID and Answers are required.' });
  }

  const answerEntries = Object.entries(answers);

  // Prepare queries to insert or update each answer
  const queries = answerEntries.map(([questionID, answer]) => {
    const query = `
      INSERT INTO answers (submissionID, questionID, studentAnswer)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE studentAnswer = VALUES(studentAnswer)
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [submissionID, questionID, JSON.stringify(answer)], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Update the submission status to 'submitted'
  const updateSubmissionQuery = `
    UPDATE student_submission
    SET status = 'submitted', submitted_at = NOW()
    WHERE submissionID = ?
  `;

  Promise.all(queries)
    .then(() => {
      return new Promise((resolve, reject) => {
        db.query(updateSubmissionQuery, [submissionID], (err, result) => {
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

  const groupQuery = `
    SELECT groupID 
    FROM enrollments 
    WHERE studentUsername = ? 
      AND courseID = ? 
      AND semester = ? 
      AND sectionID = ?
  `;

  db.query(groupQuery, [studentUsername, courseID, semester, sectionID], (groupErr, groupResults) => {
    if (groupErr) {
      console.error('Database error:', groupErr);
      return res.status(500).json({ message: 'Database error', error: groupErr });
    }

    const studentGroupID = groupResults[0]?.groupID;

    const assignmentQuery = `
      SELECT 
        a.assignmentID, 
        a.assignmentTitle, 
        a.dueDateTime, 
        CASE 
          WHEN COUNT(ss.status) = SUM(CASE WHEN ss.status = 'submitted' THEN 1 ELSE 0 END) 
          THEN 'complete' 
          ELSE 'in_progress' 
        END AS status
      FROM assignments a
      LEFT JOIN student_submission ss 
        ON a.assignmentID = ss.assignmentID 
        AND ss.studentUsername = ?
      WHERE a.courseID = ? 
        AND a.semester = ? 
        AND a.sectionID = ?
        AND a.published = TRUE
      GROUP BY a.assignmentID
    `;

    db.query(assignmentQuery, [studentUsername, courseID, semester, sectionID], (assignErr, assignments) => {
      if (assignErr) {
        console.error('Database error:', assignErr);
        return res.status(500).json({ message: 'Database error', error: assignErr });
      }

      if (assignments.length === 0) {
        return res.status(404).json({ message: 'No assignments found for this section.' });
      }

      const groupsQuery = `
        SELECT groupID, groupName 
        FROM student_groups 
        WHERE courseID = ? 
          AND sectionID = ? 
          AND semester = ? 
          AND groupID != ?
      `;

      db.query(groupsQuery, [courseID, sectionID, semester, studentGroupID], (groupsErr, groups) => {
        if (groupsErr) {
          console.error('Database error:', groupsErr);
          return res.status(500).json({ message: 'Database error', error: groupsErr });
        }

        res.status(200).json({ assignments, groups });
      });
    });
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

exports.fetchGroupMembersAssignments = (req, res) => {
  const { username, groupID, assignmentID } = req.params;

  if (!username || !groupID || !assignmentID) {
    return res.status(400).json({ message: 'All parameters (username, groupID, assignmentID) are required.' });
  }

  const query = `
    SELECT 
      ss.submissionID,
      ss.status, 
      u.firstName, 
      u.lastName,
      sg.groupName
    FROM student_submission ss
    JOIN users u ON ss.evaluateeUsername = u.username
    JOIN enrollments e ON u.username = e.studentUsername
    JOIN student_groups sg ON e.groupID = sg.groupID
    WHERE ss.assignmentID = ? 
      AND ss.studentUsername = ? 
      AND e.groupID = ?
  `;

  db.query(query, [assignmentID, username, groupID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No entries found for this group and assignment.' });
    }

    const groupName = results[0].groupName;
    const evaluations = results.map(entry => ({
      submissionID: entry.submissionID,
      status: entry.status,
      fullName: `${entry.firstName} ${entry.lastName}`,
    }));

    res.status(200).json({ groupName, evaluations });
  });
};

exports.fetchStudentQuestions = (req, res) => {
  const { studentUsername, courseID, semester, sectionID, assignmentID } = req.params;

  if (!studentUsername || !courseID || !semester || !sectionID || !assignmentID) {
    return res.status(400).json({ message: 'All parameters (studentUsername, courseID, semester, sectionID, assignmentID) are required.' });
  }

  const query = `
    SELECT q.questionID, q.questionText, q.questionType, q.questionOptions, 
           a.assignmentTitle, a.evaluateGoals, a.published
    FROM questions q
    JOIN assignments a ON q.assignmentID = a.assignmentID
    WHERE q.assignmentID = ?
  `;

  db.query(query, [assignmentID], async (err, questions) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this assignment.' });
    }

    const { assignmentTitle, evaluateGoals, published } = questions[0];

    const enrichedQuestions = await Promise.all(questions.map(async (question) => {
      if (question.questionType === 'goal') {
        return new Promise((resolve, reject) => {
          const goalQuery = `
            SELECT goalText 
            FROM goals 
            WHERE studentUsername = ? AND assignmentID = ?
          `;

          db.query(goalQuery, [studentUsername, assignmentID], (goalErr, goalResults) => {
            if (goalErr) {
              console.error('Database error:', goalErr);
              return reject(goalErr);
            }

            let enrichedQuestionText = question.questionText;
            if (goalResults.length > 0) {
              enrichedQuestionText += `\n\nGoal:\n${goalResults[0].goalText}`;
            } else {
              enrichedQuestionText += `\n\nThe student hasn't set the goal yet. Please come back later.`;
            }

            resolve({
              ...question,
              questionText: enrichedQuestionText
            });
          });
        });
      } else {
        return question;
      }
    }));

    res.status(200).json({ assignmentTitle, evaluateGoals, published, questions: enrichedQuestions });
  });
};
