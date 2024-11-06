const db = require('../db');

exports.createGroup = (req, res) => {
  const { groupName, courseID, sectionID, semester } = req.body;

  if (!groupName || !courseID || !sectionID || !semester) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO student_groups (groupName, courseID, sectionID, semester)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [groupName, courseID, sectionID, semester], (err, result) => {
    if (err) {
      console.error('Error creating group:', err);
      return res.status(500).json({ message: 'Error creating group', error: err });
    }

    res.status(201).json({ message: 'Group created successfully!', groupId: result.insertId });
  });
};

exports.fetchGroups = (req, res) => {
  const { courseID, sectionID, semester } = req.params;
  console.log(req.params);

  if (!courseID || !sectionID || !semester) {
    return res.status(400).json({ message: 'courseID, sectionID, and semester are required.' });
  }

  const query = `
    SELECT 
      g.groupID, 
      g.groupName, 
      e.studentUsername, 
      u.firstName, 
      u.lastName
    FROM student_groups g
    LEFT JOIN enrollments e ON g.groupID = e.groupID
    LEFT JOIN users u ON e.studentUsername = u.username
    WHERE g.courseID = ? AND g.sectionID = ? AND g.semester = ?
    ORDER BY g.groupID, u.username
  `;

  db.query(query, [courseID, sectionID, semester], (err, results) => {
    if (err) {
      console.error('Error fetching groups:', err);
      return res.status(500).json({ message: 'Error fetching groups', error: err });
    }

    const groups = {};
    results.forEach(row => {
      if (!groups[row.groupID]) {
        groups[row.groupID] = {
          groupID: row.groupID,
          groupName: row.groupName,
          students: []
        };
      }

      if (row.studentUsername) {
        groups[row.groupID].students.push({
          username: row.studentUsername,
          firstName: row.firstName,
          lastName: row.lastName
        });
      }
    });

    const groupList = Object.values(groups);
    
    res.status(200).json({ groups: groupList });
  });
};