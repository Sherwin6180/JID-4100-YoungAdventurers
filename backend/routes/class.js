const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/getSectionsByCourse/:courseID/:semester', classController.getSectionsByCourse);
router.get('/getSectionDetails/:courseID/:semester/:sectionID', classController.getSectionDetails);
router.get('/getEnrolledStudents/:courseID/:semester/:sectionID', classController.getEnrolledStudents);
router.post('/addEnrollment', classController.addEnrollment);


module.exports = router;