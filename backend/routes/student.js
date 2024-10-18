const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/getSectionsByStudent/:studentUsername', studentController.getSectionsByStudent);


module.exports = router;
