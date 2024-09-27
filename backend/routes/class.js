const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/getSectionsByCourse/:courseID/:semester', classController.getSectionsByCourse);


module.exports = router;
