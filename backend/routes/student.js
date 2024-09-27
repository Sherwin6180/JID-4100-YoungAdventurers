const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/populate', studentController.register);

module.exports = router;
