const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/getSecurityQuestions', authController.getSecurityQuestions);
router.post('/verifySecurityAnswers', authController.verifySecurityAnswers);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
