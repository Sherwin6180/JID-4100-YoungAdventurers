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
