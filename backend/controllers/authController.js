const db = require('../db');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { username, email, password, accountType, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;

  if (!username || !email || !password || !accountType || !securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const hashedAnswer1 = bcrypt.hashSync(securityAnswer1, 10); // hash security answer 1
  const hashedAnswer2 = bcrypt.hashSync(securityAnswer2, 10); // hash security answer 2

  db.query(
    'INSERT INTO users (username, email, password, accountType, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [username, email, hashedPassword, accountType, securityQuestion1, hashedAnswer1, securityQuestion2, hashedAnswer2],
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
