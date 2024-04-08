const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host     : 'database-2.croas0wiukl6.us-east-2.rds.amazonaws.com',
  port     : '3306',
  user     : 'admin',
  password : '12345678'
});

db.connect(err => {
  if (err) {
    console.error('Failed to connect to database: ' + err.stack);
    return;
  }

  console.log('Successfully connected to database');
});

db.query('USE evaluation', (err) => {
  if (err) {
    console.error('Error selecting database:', err);
    return;
  }
  console.log('Database switched to evaluation');
});

app.get('/api/assignments/:assignmentId/tasks', (req, res) => {
  const { assignmentId } = req.params;
  const evaluatorId = req.query.evaluatorId; evaluatorId

  const sql = `
    SELECT t.task_id, p.first_name, p.last_name,
           IF(ISNULL(r.response_id), 'Incomplete', 'Completed') AS status
    FROM task t
    JOIN person p ON t.presenter_id = p.person_id
    LEFT JOIN response r ON t.task_id = r.task_id AND r.evaluator_id = ?
    WHERE t.assignment_id = ?
    GROUP BY t.task_id
  `;

  db.query(sql, [evaluatorId, assignmentId], (err, results) => {
    if (err) {
      console.error('Error fetching tasks for evaluator:', err);
      res.status(500).send('An error occurred while fetching tasks.');
      return;
    }
    res.json(results);
  });
});

app.get('/api/assignments/:assignmentId/questions', (req, res) => {
  const { assignmentId } = req.params;
  
  const sql = 'SELECT q.question_id, q.question_text FROM question q WHERE q.assignment_id = ?';
  
  db.query(sql, [assignmentId], (error, results) => {
    if (error) {
      console.error('Error fetching questions:', error);
      res.status(500).send('An error occurred while fetching questions.');
      return;
    }
    res.json(results);
  });
});

app.post('/api/answers', (req, res) => {
  
  const { task_id, question_id, evaluator_id, answer_text } = req.body;

  
  const sql = `
    INSERT INTO response (task_id, question_id, evaluator_id, answer_text)
    VALUES (?, ?, ?, ?)
  `;

  
  db.query(sql, [task_id, question_id, evaluator_id, answer_text], (error, results) => {
    if (error) {
      console.error('Error submitting answer:', error);
      res.status(500).send('An error occurred while submitting the answer.');
      return;
    }
    
    res.send('Answer submitted successfully.');
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
