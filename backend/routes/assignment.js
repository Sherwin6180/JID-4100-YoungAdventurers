const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/createAssignment', assignmentController.createAssignment);
router.get('/fetchAssignments/:courseID/:semester/:sectionID', assignmentController.fetchAssignments);
router.delete('/removeAssignment', assignmentController.removeAssignment);
router.post('/addQuestion', assignmentController.addQuestion);
router.get('/fetchQuestions/:assignmentID', assignmentController.fetchQuestions);

module.exports = router;
