const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/getSectionsByStudent/:studentUsername', studentController.getSectionsByStudent);
router.get('/getStudentAnswers/:assignmentID/:studentUsername/:submissionID', studentController.getStudentAnswers);
router.post('/saveStudentAnswers', studentController.saveStudentAnswers);
router.post('/submitStudentAnswers', studentController.submitStudentAnswers);
router.get('/fetchAssignments/:studentUsername/:courseID/:semester/:sectionID', studentController.fetchAssignments);
router.post('/joinGroup', studentController.joinGroup);
router.get('/fetchGroupMembersAssignments/:username/:groupID/:assignmentID', studentController.fetchGroupMembersAssignments);
router.post('/setGoal', studentController.setGoal);
router.get('/checkStudentGoal/:assignmentID/:studentUsername', studentController.checkStudentGoal);
router.get('/getGoalsForSection/:courseID/:sectionID/:semester/:studentUsername', studentController.getStudentGoalsForSection);
router.post('/updateGoal', studentController.updateGoal);
router.get('/checkGroupMembership/:studentUsername/:courseID/:sectionID/:semester', studentController.checkGroupMembership);
router.get('/getAverageGoalRatings/:studentUsername/:courseID/:sectionID/:semester', studentController.getAverageGoalRatings);

module.exports = router;
