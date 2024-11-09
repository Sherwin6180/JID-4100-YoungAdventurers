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
router.get('/fetchStudentQuestions/:studentUsername/:courseID/:semester/:sectionID/:assignmentID', studentController.fetchStudentQuestions);

module.exports = router;
