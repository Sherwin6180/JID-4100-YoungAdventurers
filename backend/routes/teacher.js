const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/teachNewCourse', teacherController.teachNewCourse);
router.get('/getCoursesByTeacher/:teacherUsername', teacherController.getCoursesByTeacher);
router.get('/getGrades/:assignmentID', teacherController.getGrades);
router.post('/publishGrades', teacherController.publishGrades);
router.get('/checkGradesPublished/:assignmentID', teacherController.checkGradesPublished);

module.exports = router;
