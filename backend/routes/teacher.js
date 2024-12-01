const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { canTreatArrayAsAnd } = require('sequelize/lib/utils');

router.post('/teachNewCourse', teacherController.teachNewCourse);
router.get('/getCoursesByTeacher/:teacherUsername', teacherController.getCoursesByTeacher);
router.get('/getGrades/:assignmentID', teacherController.getGrades);
router.post('/publishGrades', teacherController.publishGrades);
router.get('/checkGradesPublished/:assignmentID', teacherController.checkGradesPublished);
router.post('/setAllowGroupChange', teacherController.setAllowGroupChange);
router.get('/getAllowGroupChangeStatus/:courseID/:sectionID/:semester', teacherController.getAllowGroupChangeStatus);
router.post('/removeStudentFromGroup', teacherController.removeStudentFromGroup);

module.exports = router;
