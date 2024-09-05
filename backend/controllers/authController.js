const db = require('../db');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { username, email, password, accountType } = req.body;
  
  if (!username || !email || !password || !accountType) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (username, email, password, accountType) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, accountType],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating account', error: err });
      }
      res.status(201).json({ message: 'Account created successfully!' });
    }
  );
};

exports.login = (req, res) => {
  const { username, password, accountType } = req.body;

  if (!username || !password || !accountType) {
    return res.status(400).json({ message: 'Please enter username, password, and account type.' });
  }

  db.query('SELECT * FROM users WHERE username = ? AND accountType = ?', [username, accountType], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error during login', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username, password, or account type.' });
    }

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username, password, or account type.' });
    }

    res.status(200).json({ message: `Login successful for ${accountType}: ${username}` });
  });
};
