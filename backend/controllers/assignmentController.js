const db = require('../db');
const dayjs = require('dayjs');

exports.createAssignment = (req, res) => {
  const { courseID, semester, sectionID, assignmentTitle, dueDateTime } = req.body;
  console.log(`courseID: ${courseID}, semester: ${semester}, sectionID: ${sectionID}, assignmentTitle: ${assignmentTitle}, dueDateTime: ${dueDateTime}`);
  
  if (!courseID || !semester || !sectionID || !assignmentTitle || !dueDateTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Convert ISO string to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
  const formattedDueDateTime = dayjs(dueDateTime).format('YYYY-MM-DD HH:mm:ss');

  db.query(
    'INSERT INTO assignments (courseID, semester, sectionID, assignmentTitle, dueDateTime) VALUES (?, ?, ?, ?, ?)',
    [courseID, semester, sectionID, assignmentTitle, formattedDueDateTime],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(201).json({
        message: 'Assignment created successfully!',
        assignment: {
          assignmentID: result.insertId,
          courseID,
          semester,
          sectionID,
          assignmentTitle,
          dueDateTime: formattedDueDateTime
        }
      });
    }
  );
};



exports.fetchAssignments = (req, res) => {
  const { courseID, semester, sectionID } = req.params;
  if (!courseID || !semester || !sectionID) {
    return res.status(400).json({ message: 'Course ID, semester, and section ID are required.' });
  }

  db.query(
    'SELECT assignmentID, assignmentTitle, dueDateTime FROM assignments WHERE courseID = ? AND semester = ? AND sectionID = ?',
    [courseID, semester, sectionID],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No assignments found for this section.' });
      }
      res.status(200).json({ assignments: results });
    }
  );
};



exports.removeAssignment = (req, res) => {
  const { assignmentID } = req.body;

  if (!assignmentID) {
    return res.status(400).json({ message: 'Assignment ID is required.' });
  }

  db.query(
    'DELETE FROM assignments WHERE assignmentID = ?',
    [assignmentID],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Assignment not found.' });
      }

      res.status(200).json({ message: 'Assignment removed successfully!' });
    }
  );
};

exports.addQuestion = (req, res) => {
  const { assignmentID, questionText, questionType, questionOptions } = req.body;
  console.log(`assignmentID: ${assignmentID}, questionText: ${questionText}, questionType: ${questionType}`)

  if (!assignmentID || !questionText || !questionType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const options = questionType === 'multiple_choice' ? JSON.stringify(questionOptions) : null;

  db.query(
    'INSERT INTO questions (assignmentID, questionText, questionType, questionOptions) VALUES (?, ?, ?, ?)',
    [assignmentID, questionText, questionType, options],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(201).json({
        message: 'Question added successfully!',
        question: {
          questionID: result.insertId,
          assignmentID,
          questionText,
          questionType,
          questionOptions: options,
        }
      });
    }
  );
};

exports.deleteQuestion = (req, res) => {
  const { questionID } = req.body;

  if (!questionID) {
    return res.status(400).json({ message: 'Question ID is required.' });
  }

  db.query(
    'DELETE FROM questions WHERE questionID = ?',
    [questionID],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Question not found.' });
      }

      res.status(200).json({ message: 'Question deleted successfully!' });
    }
  );
};

exports.updateEvaluateGoals = (req, res) => {
  const { assignmentID, evaluateGoals } = req.body;
  if (assignmentID === undefined || evaluateGoals === undefined) {
    return res.status(400).json({ message: 'assignmentID and evaluateGoals are required' });
  }

  const evaluateGoalsValue = evaluateGoals ? 1 : 0;

  const query = `
    UPDATE assignments
    SET evaluateGoals = ?
    WHERE assignmentID = ?
  `;

  db.query(query, [evaluateGoalsValue, assignmentID], (err, result) => {
    if (err) {
      console.error('Error updating evaluateGoals:', err);
      return res.status(500).json({ message: 'Error updating evaluateGoals', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'evaluateGoals updated successfully' });
  });
};


exports.fetchQuestions = (req, res) => {
  const { assignmentID } = req.params;

  if (!assignmentID) {
    return res.status(400).json({ message: 'Assignment ID is required.' });
  }

  const query = `
    SELECT q.questionID, q.questionText, q.questionType, q.questionOptions, 
           a.assignmentTitle, a.evaluateGoals, a.published
    FROM questions q
    JOIN assignments a ON q.assignmentID = a.assignmentID
    WHERE q.assignmentID = ?
  `;

  db.query(query, [assignmentID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No questions found for this assignment.' });
    }

    const { assignmentTitle, evaluateGoals, published } = results[0];

    const questions = results.map(({ assignmentTitle, evaluateGoals, published, ...question }) => question);

    res.status(200).json({ assignmentTitle, evaluateGoals, published, questions });
  });
};

exports.publishAssignment = async (req, res) => {
  const { assignmentID } = req.body;

  if (!assignmentID) {
    return res.status(400).json({ message: 'Assignment ID is required.' });
  }

  try {
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.query('START TRANSACTION', (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // 1. Set assignment to published
    await new Promise((resolve, reject) => {
      const query = `UPDATE assignments SET published = TRUE WHERE assignmentID = ?`;
      db.query(query, [assignmentID], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error('Assignment not found.'));
        resolve();
      });
    });

    // 2. Get course, section, and semester for the assignment
    const assignmentDetails = await new Promise((resolve, reject) => {
      const query = `SELECT courseID, sectionID, semester FROM assignments WHERE assignmentID = ?`;
      db.query(query, [assignmentID], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error('Assignment not found.'));
        resolve(result[0]);
      });
    });

    const { courseID, sectionID, semester } = assignmentDetails;

    // 3. Fetch all enrolled students in the course section
    const students = await new Promise((resolve, reject) => {
      const query = `SELECT studentUsername, groupID FROM enrollments WHERE courseID = ? AND sectionID = ? AND semester = ?`;
      db.query(query, [courseID, sectionID, semester], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // 4. Group students by groupID to identify evaluatees outside the group
    const groups = {};
    students.forEach(student => {
      if (!groups[student.groupID]) groups[student.groupID] = [];
      groups[student.groupID].push(student.studentUsername);
    });

    // 5. For each student, create entries in `student_submission` for evaluations outside their group
    const submissionPromises = students.map((student) => {
      const evaluatees = Object.keys(groups)
        .filter(groupID => groupID !== student.groupID.toString())
        .flatMap(groupID => groups[groupID]);

      const submissionEntries = evaluatees.map(evaluateeUsername => [
        assignmentID,
        student.studentUsername,
        evaluateeUsername,
        'in_progress',
      ]);

      // Insert entries in `student_submission` for each student/evaluatee pair
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO student_submission (assignmentID, studentUsername, evaluateeUsername, status) VALUES ?`;
        db.query(query, [submissionEntries], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    // Execute all submission entry promises
    await Promise.all(submissionPromises);

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.query('COMMIT', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(200).json({ message: 'Assignment published successfully.' });
  } catch (error) {
    console.error('Error publishing assignment:', error);

    // Rollback transaction in case of error
    await new Promise((resolve, reject) => {
      db.query('ROLLBACK', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(500).json({ message: 'An error occurred while publishing the assignment.', error: error.message });
  }
};