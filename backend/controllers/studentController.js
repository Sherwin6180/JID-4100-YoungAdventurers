const db = require('../db');
const bcrypt = require('bcrypt');

exports.populate = (req, res) => {
    const {} = req.body;

    db.query('SELECT accountType, id, username FROM users', (err, result) => {
        if (err) {
        return res.status(500).json({ message: 'Error accessing roster', error: err });
        }

        const users = result;
        const studentTuples = [];
        
        for (const user of users) {
        if (user.accountType === 'student') {
            studentTuples.push([user.id, user.username]);
        }
        }

        res.status(200).json(studentTuples);
    });
};

exports.addStudent = (req, res) => {
};

exports.removeStudent = (req, res) => {
};