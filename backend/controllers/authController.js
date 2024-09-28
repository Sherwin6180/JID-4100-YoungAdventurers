const db = require('../db');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { username, email, password, firstName, lastName, accountType, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;

  if (!username || !email || !password || !firstName || !lastName || !accountType || !securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const hashedAnswer1 = bcrypt.hashSync(securityAnswer1, 10); // hash security answer 1
  const hashedAnswer2 = bcrypt.hashSync(securityAnswer2, 10); // hash security answer 2

  db.query(
    'INSERT INTO users (username, email, password, firstName, lastName, accountType, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [username, email, hashedPassword, firstName, lastName, accountType, securityQuestion1, hashedAnswer1, securityQuestion2, hashedAnswer2],
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

// Fetch security questions by email
exports.getSecurityQuestions = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  db.query('SELECT securityQuestion1, securityQuestion2 FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: 'Error fetching security questions.' });
    }

    const user = results[0];
    res.status(200).json({
      success: true,
      question1: user.securityQuestion1,
      question2: user.securityQuestion2,
    });
  });
};

// Verify security answers
exports.verifySecurityAnswers = (req, res) => {
  const { email, answer1, answer2 } = req.body;

  if (!email || !answer1 || !answer2) {
    return res.status(400).json({ success: false, message: 'Please fill out all fields.' });
  }

  db.query('SELECT securityAnswer1, securityAnswer2 FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: 'Error fetching security answers.' });
    }

    const user = results[0];
    const isAnswer1Valid = bcrypt.compareSync(answer1, user.securityAnswer1); // Compare hashed answer1
    const isAnswer2Valid = bcrypt.compareSync(answer2, user.securityAnswer2); // Compare hashed answer2

    if (!isAnswer1Valid || !isAnswer2Valid) {
      return res.status(401).json({ success: false, message: 'Security answers do not match.' });
    }

    res.status(200).json({ success: true });
  });
};

// Reset password
exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide an email and a new password.' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password

  db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error resetting password.' });
    }

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  });
};