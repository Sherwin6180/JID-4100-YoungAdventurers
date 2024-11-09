const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/createAssignment', assignmentController.createAssignment);
router.get('/fetchAssignments/:courseID/:semester/:sectionID', assignmentController.fetchAssignments);
router.delete('/removeAssignment', assignmentController.removeAssignment);
router.post('/addQuestion', assignmentController.addQuestion);
router.delete('/deleteQuestion', assignmentController.deleteQuestion);
router.post('/updateEvaluateGoals', assignmentController.updateEvaluateGoals);
router.get('/fetchQuestions/:assignmentID', assignmentController.fetchQuestions);
router.post('/publishAssignment', assignmentController.publishAssignment);

module.exports = router;
