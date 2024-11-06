const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/createGroup', groupController.createGroup);
router.get('/fetchGroups/:courseID/:sectionID/:semester', groupController.fetchGroups);

module.exports = router;
