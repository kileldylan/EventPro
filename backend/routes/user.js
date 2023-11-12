const express = require('express')
const userController = require('../controllers/userController');
const eventsController = require('../controllers/eventsController');

const router = express.Router()

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/checkEmail', userController.checkEmail);
router.get('/checkUsername', userController.checkUsername);
router.get('/getUser/:username', userController.getUserDetails);

module.exports = router