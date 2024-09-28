const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/teachNewCourse', teacherController.teachNewCourse);
router.get('/getCoursesByTeacher/:teacherUsername', teacherController.getCoursesByTeacher);


module.exports = router;
