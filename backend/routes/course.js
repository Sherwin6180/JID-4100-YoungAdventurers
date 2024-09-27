const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/createCourse', courseController.createCourse);
// router.post('/getCoursesByTeacher', courseController.getCoursesByTeacher);


module.exports = router;
