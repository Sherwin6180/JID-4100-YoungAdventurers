const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/createAssignment', assignmentController.createAssignment);
router.get('/fetchAssignments/:courseID/:semester/:sectionID', assignmentController.fetchAssignments);
router.delete('/removeAssignment', assignmentController.removeAssignment);

module.exports = router;
