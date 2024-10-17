const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/getCoursesByStudent/:studentUsername', studentController.getCoursesByStudent);


module.exports = router;
