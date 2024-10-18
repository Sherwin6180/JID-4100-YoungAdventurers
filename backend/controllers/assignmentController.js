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

exports.fetchQuestions = (req, res) => {
  const { assignmentID } = req.params;

  if (!assignmentID) {
    return res.status(400).json({ message: 'Assignment ID is required.' });
  }

  db.query(
    'SELECT questionID, questionText, questionType, questionOptions FROM questions WHERE assignmentID = ?',
    [assignmentID],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No questions found for this assignment.' });
      }

      res.status(200).json({ questions: results });
    }
  );
};